"use client";

import { useEffect, useState } from "react";
import { Shield, Search, UserCog, AlertCircle, Building2 } from "lucide-react";

type UserProfile = {
  _id: string; 
  email: string;
  role: "admin" | "finance" | "staff";
  createdAt: string;
};

export default function UsersManagementPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/users");
            
            if (!res.ok) {
                if (res.status === 403) throw new Error("Access Denied: You must be an Admin.");
                throw new Error("Failed to fetch users");
            }

            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            console.error("Error fetching users:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

const updateUserRole = async (userId: string, newRole: "staff" | "finance") => {
    
    const previousUsers = [...users];
    setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));

    try {
        // Update Database
        const res = await fetch(`/api/admin/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }), // 
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to update role");
        }
        
        // Success
        console.log("Database updated successfully:", data);

    } catch (err: any) {
        console.error("Error updating role:", err);
        alert(`Failed to save to database: ${err.message}`);
        
        // 3. Revert UI if database update failed
        setUsers(previousUsers); 
    }
};

    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            user.email?.toLowerCase().includes(searchLower) ||
            user.role?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="p-6 md:p-8 min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <UserCog className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    User Management
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Promote users to Finance to allow sales verification.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{users.length}</p>
                        </div>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <UserCog className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Finance Team</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {users.filter(u => u.role === 'finance').length}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {users.filter(u => u.role === 'staff').length}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by email..."
                            className="pl-10 w-full md:w-1/2 p-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <UserCog className="h-12 w-12 mx-auto mb-3 opacity-40" />
                        <p className="font-medium">No users found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-slate-700">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Email / User
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                                        Current Role
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                                                    <span className="font-bold text-sm">
                                                        {user.email.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {user.email}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                user.role === 'finance'
                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : user.role === 'admin'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                {/* Role Change Actions */}
                                                {user.role !== 'admin' && (
                                                    <>
                                                        {user.role !== 'finance' && (
                                                            <button
                                                                onClick={() => updateUserRole(user._id, "finance")}
                                                                className="text-xs px-3 py-1.5 bg-purple-50 border border-purple-200 dark:border-purple-800 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors font-medium"
                                                            >
                                                                Promote to Finance
                                                            </button>
                                                        )}
                                                        {user.role !== 'staff' && (
                                                            <button
                                                                onClick={() => updateUserRole(user._id, "staff")}
                                                                className="text-xs px-3 py-1.5 bg-blue-50 border border-blue-200 dark:border-blue-800 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
                                                            >
                                                                Set to Staff
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}