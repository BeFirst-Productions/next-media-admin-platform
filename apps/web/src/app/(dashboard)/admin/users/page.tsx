"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Building2,
  Shield,
  Search,

  RotateCcw,
  Pencil,
  Trash2,
  ChevronDown,
  X,
  Plus,
  ArrowLeft,
  ArrowRight,
  Award,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Copy,
  Check,
  Target,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  DUMMY_USERS,
  USER_STATS,
  ManagedUser,
  COMMISSION_SLABS_CONFIG,
} from "@/datas/users.data";
import { useToast } from "@/hooks/useToast";
import { DataTable, DataTableColumn } from "@/components/ui/DataTable";

export default function UserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<ManagedUser[]>(DUMMY_USERS);
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);

  // Filter state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("ALL");
  const [selectedDepartment, setSelectedDepartment] = React.useState("ALL");
  const [selectedStatus, setSelectedStatus] = React.useState("ALL");
  const [selectedSlabFilter, _setSelectedSlabFilter] = React.useState("ALL");

  // Pagination state
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Sorting state
  const [sortField, setSortField] = React.useState<keyof ManagedUser>("id");
  const [sortAsc, setSortAsc] = React.useState(true);

  // In-page form view state (replaces popup modal)
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<ManagedUser | null>(null);
  const formRef = React.useRef<HTMLDivElement>(null);

  // Profile modal view state
  const [profileUser, setProfileUser] = React.useState<ManagedUser | null>(null);
  const [copiedId, setCopiedId] = React.useState(false);
  const [customAchievedInput, setCustomAchievedInput] = React.useState("");

  const handleCopyId = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(id);
    }
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
    toast({
      type: "info",
      title: "ID Copied",
      description: `Copied ${id} to clipboard.`,
    });
  };

  const handleUpdateUserSlab = (slab: "None" | "Slab 1" | "Slab 2" | "Slab 3") => {
    if (!profileUser) return;
    const slabData = {
      "None": {
        salesTarget: "AED 0",
        salesAchieved: "AED 0",
        commission: "0%",
        commissionAtTarget: "AED 0",
        achievementBonus: "AED 0",
        basicSalary: "AED 0",
      },
      "Slab 1": {
        salesTarget: "AED 15,000",
        salesAchieved: "AED 10,500",
        commission: "10%",
        commissionAtTarget: "AED 1,500",
        achievementBonus: "AED 1,000",
        basicSalary: "AED 1,500",
      },
      "Slab 2": {
        salesTarget: "AED 30,000",
        salesAchieved: "AED 22,500",
        commission: "15%",
        commissionAtTarget: "AED 4,500",
        achievementBonus: "AED 1,500",
        basicSalary: "AED 1,500",
      },
      "Slab 3": {
        salesTarget: "AED 50,000",
        salesAchieved: "AED 42,500",
        commission: "20%",
        commissionAtTarget: "AED 10,000",
        achievementBonus: "AED 2,000",
        basicSalary: "AED 1,500",
      },
    }[slab];

    const updatedUser: ManagedUser = {
      ...profileUser,
      commissionSlab: slab,
      ...slabData,
    };

    setProfileUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    toast({
      type: "success",
      title: "Stage Updated",
      description: `${updatedUser.name} stage updated to ${slab === "None" ? "Exempt / None" : slab}.`,
    });
  };

  const handleUpdateAchievedSales = (amount: number) => {
    if (!profileUser) return;
    const formatted = `AED ${amount.toLocaleString()}`;
    const updatedUser: ManagedUser = {
      ...profileUser,
      salesAchieved: formatted,
    };
    setProfileUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    toast({
      type: "info",
      title: "Sales Achieved Updated",
      description: `Target achievement updated to ${formatted}.`,
    });
  };

  // Form state
  interface UserFormState extends Partial<ManagedUser> {
    password?: string;
    confirmPassword?: string;
  }

  const [formData, setFormData] = React.useState<UserFormState>({
    name: "",
    email: "",
    phone: "+971 50 ",
    password: "",
    confirmPassword: "",
    role: "Sales Executive",
    department: "Sales",
    commissionSlab: "None",
    salesTarget: "AED 0",
    commission: "0%",
    commissionAtTarget: "AED 0",
    achievementBonus: "AED 0",
    basicSalary: "AED 0",
    status: "Active",
    joiningDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  });

  // Password visibility state
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Validation state
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = React.useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = React.useState(false);

  // Filter and sort logic
  const filteredUsers = React.useMemo(() => {
    return users
      .filter((user) => {
        const matchesSearch =
          !searchQuery.trim() ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole =
          selectedRole === "ALL" || user.role === selectedRole;

        const matchesDept =
          selectedDepartment === "ALL" || user.department === selectedDepartment;

        const matchesStatus =
          selectedStatus === "ALL" || user.status === selectedStatus;

        const matchesSlab =
          selectedSlabFilter === "ALL" || user.commissionSlab === selectedSlabFilter;

        return matchesSearch && matchesRole && matchesDept && matchesStatus && matchesSlab;
      })
      .sort((a, b) => {
        const aVal = a[sortField] ?? "";
        const bVal = b[sortField] ?? "";
        if (aVal < bVal) return sortAsc ? -1 : 1;
        if (aVal > bVal) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [users, searchQuery, selectedRole, selectedDepartment, selectedStatus, selectedSlabFilter, sortField, sortAsc]);

  // Paginated records
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Adjust current page if filters reduce total pages
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Close profile modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && profileUser) {
        setProfileUser(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [profileUser]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedUserIds((prev) => prev.filter((item) => item !== id));
    toast({
      type: "success",
      title: "User Removed",
      description: `${target?.name || id} has been removed successfully.`,
    });
  };

  const validateField = (
    field: string,
    value: any
  ): string | undefined => {
    switch (field) {
      case "name": {
        const val = typeof value === "string" ? value.trim() : "";
        if (!val) return "Full Name is required.";
        if (val.length < 3) return "Name must be at least 3 characters.";
        if (val.length > 60) return "Name cannot exceed 60 characters.";
        if (!/^[a-zA-ZÀ-ÿ\s'.-]+$/.test(val)) {
          return "Name can only contain alphabetic letters, spaces, hyphens, and apostrophes.";
        }
        return undefined;
      }
      case "email": {
        const val = typeof value === "string" ? value.trim() : "";
        if (!val) return "Email address is required.";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(val)) {
          return "Please enter a valid email address (e.g. name@next.com).";
        }
        const isDuplicate = users.some(
          (u) =>
            u.email.toLowerCase() === val.toLowerCase() &&
            u.id !== editingUser?.id
        );
        if (isDuplicate) {
          return "This email is already registered to another user.";
        }
        return undefined;
      }
      case "phone": {
        const val = typeof value === "string" ? value.trim() : "";
        if (!val) return "Phone number is required.";

        // Clean phone number (strip spaces, hyphens, brackets)
        const clean = val.replace(/[\s\-()]/g, "");

        // Valid Dubai/UAE phone formats:
        // 1. Mobile Intl: +97150..., +97152..., +97154..., +97155..., +97156..., +97158... (or 009715X...)
        // 2. Dubai Landline Intl: +9714... (or 009714...)
        // 3. Mobile Local: 050..., 052..., 054..., 055..., 056..., 058...
        // 4. Dubai Landline Local: 04...
        // 5. Bare 9-digit Mobile: 50..., 52..., 54..., 55..., 56..., 58...
        const isUaeMobileIntl = /^(\+971|00971)5[024568]\d{7}$/.test(clean);
        const isDubaiLandlineIntl = /^(\+971|00971)4\d{7}$/.test(clean);
        const isUaeMobileLocal = /^05[024568]\d{7}$/.test(clean);
        const isDubaiLandlineLocal = /^04\d{7}$/.test(clean);
        const isUaeMobileBare = /^5[024568]\d{7}$/.test(clean);

        if (
          !isUaeMobileIntl &&
          !isDubaiLandlineIntl &&
          !isUaeMobileLocal &&
          !isDubaiLandlineLocal &&
          !isUaeMobileBare
        ) {
          return "Please enter a valid Dubai / UAE phone number (e.g. +971 50 123 4567 or 050 123 4567).";
        }
        return undefined;
      }
      case "password": {
        const val = typeof value === "string" ? value : "";
        if (!editingUser && !val) {
          return "Password is required for user account creation.";
        }
        if (val) {
          if (val.length < 8) {
            return "Password must be at least 8 characters long.";
          }
          if (!/[A-Za-z]/.test(val) || !/[0-9]/.test(val)) {
            return "Password must contain at least one letter and one number.";
          }
        }
        return undefined;
      }
      case "confirmPassword": {
        const val = typeof value === "string" ? value : "";
        if (!editingUser && !val) {
          return "Please confirm your password.";
        }
        if (val || formData.password) {
          if (val !== formData.password) {
            return "Passwords do not match.";
          }
        }
        return undefined;
      }
      case "department": {
        if (!value) return "Please select a department.";
        const allowedDepts = ["Sales", "Marketing", "Administration"];
        if (!allowedDepts.includes(value)) {
          return "Please select a valid department from the options.";
        }
        return undefined;
      }
      case "role": {
        if (!value) return "Please select a system role.";
        const allowedRoles = [
          "Sales Executive",
          "Marketing Executive",
          "Admin",
          "Super Admin",
        ];
        if (!allowedRoles.includes(value)) {
          return "Please select a valid system role.";
        }
        return undefined;
      }
      case "status": {
        if (!value) return "Please select an account status.";
        if (!["Active", "Inactive"].includes(value)) {
          return "Status must be either Active or Inactive.";
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const validateAllFields = (data: UserFormState) => {
    const fieldsToValidate: (keyof UserFormState)[] = [
      "name",
      "email",
      "phone",
      "password",
      "confirmPassword",
      "department",
      "status",
    ];
    const errors: Record<string, string> = {};

    for (const field of fieldsToValidate) {
      const err = validateField(field, data[field]);
      if (err) {
        errors[field] = err;
      }
    }

    setFormErrors(errors);
    return errors;
  };

  const handleFieldChange = (name: keyof UserFormState, value: any) => {
    const updated = { ...formData, [name]: value };

    // Automatically derive role when department changes
    if (name === "department") {
      const mappedRole: ManagedUser["role"] =
        value === "Administration"
          ? "Admin"
          : value === "Marketing"
          ? "Marketing Executive"
          : "Sales Executive";
      updated.role = mappedRole;
    }

    setFormData(updated);

    if (submitAttempted || touchedFields[name]) {
      const err = validateField(name, value);
      setFormErrors((prev) => {
        const next = { ...prev };
        if (err) {
          next[name] = err;
        } else {
          delete next[name];
        }
        return next;
      });
    }

    // Dynamic password match re-check
    if (name === "password" && (submitAttempted || touchedFields.confirmPassword)) {
      if (updated.confirmPassword && updated.confirmPassword !== value) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match.",
        }));
      } else if (updated.confirmPassword && updated.confirmPassword === value) {
        setFormErrors((prev) => {
          const next = { ...prev };
          delete next.confirmPassword;
          return next;
        });
      }
    }
  };

  const handleFieldBlur = (name: keyof UserFormState) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, formData[name]);
    setFormErrors((prev) => {
      const next = { ...prev };
      if (err) {
        next[name] = err;
      } else {
        delete next[name];
      }
      return next;
    });
  };

  // Profile image upload & drag-and-drop state & handlers
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        type: "error",
        title: "Invalid File Type",
        description: "Please upload an image file (PNG, JPG, SVG, or WebP).",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        type: "error",
        title: "File Too Large",
        description: "Image size should be less than 5MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        handleFieldChange("avatar", result);
        toast({
          type: "success",
          title: "Photo Selected",
          description: "Profile photo uploaded successfully.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemovePhoto = () => {
    handleFieldChange("avatar", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      type: "info",
      title: "Photo Removed",
      description: "Default placeholder avatar will be used.",
    });
  };

  const handleOpenCreateForm = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsDragging(false);
    setFormData({
      name: "",
      email: "",
      phone: "+971 50 ",
      password: "",
      confirmPassword: "",
      avatar: "",
      role: "Sales Executive",
      department: "Sales",
      commissionSlab: "None",
      salesTarget: "AED 0",
      commission: "0%",
      commissionAtTarget: "AED 0",
      achievementBonus: "AED 0",
      basicSalary: "AED 0",
      status: "Active",
      joiningDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormErrors({});
    setTouchedFields({});
    setSubmitAttempted(false);
    setEditingUser(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenEditForm = (user: ManagedUser) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsDragging(false);
    setFormData({
      ...user,
      password: "",
      confirmPassword: "",
      avatar: user.avatar,
      salesTarget: user.salesTarget || "",
      commission: user.commission || "",
      commissionSlab: user.commissionSlab || "None",
      basicSalary: user.basicSalary || "",
      achievementBonus: user.achievementBonus || "",
      commissionAtTarget: user.commissionAtTarget || "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormErrors({});
    setTouchedFields({});
    setSubmitAttempted(false);
    setEditingUser(user);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const errors = validateAllFields(formData);
    const errorKeys = Object.keys(errors);

    if (errorKeys.length > 0) {
      toast({
        type: "error",
        title: "Validation Error",
        description: `Please resolve the ${errorKeys.length} highlighted error${
          errorKeys.length > 1 ? "s" : ""
        } before saving.`,
      });
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const rawTarget = (formData.salesTarget ?? "").replace(/[^0-9.]/g, "");
    const formattedTarget = rawTarget && parseFloat(rawTarget) > 0
      ? `AED ${Number(rawTarget).toLocaleString()}`
      : "AED 0";

    const rawCommission = (formData.commission ?? "").replace(/[^0-9.]/g, "");
    const formattedCommission = rawCommission && parseFloat(rawCommission) > 0
      ? `${rawCommission}%`
      : "0%";

    const rawSalary = (formData.basicSalary ?? "").replace(/[^0-9.]/g, "");
    const formattedSalary = rawSalary && parseFloat(rawSalary) > 0
      ? `AED ${Number(rawSalary).toLocaleString()}`
      : "AED 0";

    const rawBonus = (formData.achievementBonus ?? "").replace(/[^0-9.]/g, "");
    const formattedBonus = rawBonus && parseFloat(rawBonus) > 0
      ? `AED ${Number(rawBonus).toLocaleString()}`
      : "";

    // Automatically calculate commission at 100% target if both target and rate are available
    let formattedCommissionAtTarget = formData.commissionAtTarget || "";
    if (rawTarget && rawCommission && parseFloat(rawTarget) > 0 && parseFloat(rawCommission) > 0) {
      const calculated = (parseFloat(rawTarget) * parseFloat(rawCommission)) / 100;
      formattedCommissionAtTarget = `AED ${Math.round(calculated).toLocaleString()}`;
    }

    const derivedRole: ManagedUser["role"] =
      formData.department === "Administration"
        ? "Admin"
        : formData.department === "Marketing"
        ? "Marketing Executive"
        : "Sales Executive";

    if (editingUser) {
      // Update existing
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? ({
                ...u,
                ...formData,
                avatar: formData.avatar?.trim() || u.avatar,
                role: derivedRole,
                name: formData.name!.trim(),
                email: formData.email!.trim().toLowerCase(),
                phone: formData.phone!.trim(),
                department: (formData.department as ManagedUser["department"]) || u.department,
                status: (formData.status as ManagedUser["status"]) || u.status,
                commissionSlab: formData.commissionSlab || "None",
                salesTarget: formattedTarget,
                commission: formattedCommission,
                basicSalary: formattedSalary,
                commissionAtTarget: formattedCommissionAtTarget || u.commissionAtTarget || "AED 0",
                achievementBonus: formattedBonus || u.achievementBonus || "AED 0",
              } as ManagedUser)
            : u
        )
      );
      toast({
        type: "success",
        title: "User Updated",
        description: `${formData.name} details have been updated successfully.`,
      });
    } else {
      // Create new
      const nextNum = 1000 + users.length + 1;
      const newUser: ManagedUser = {
        id: `USR-${nextNum}`,
        name: formData.name!.trim(),
        avatar:
          formData.avatar?.trim() ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        email: formData.email!.trim().toLowerCase(),
        phone: formData.phone!.trim(),
        role: derivedRole,
        department: (formData.department as ManagedUser["department"]) || "Sales",
        commissionSlab: (formData.commissionSlab as ManagedUser["commissionSlab"]) || "None",
        salesTarget: formattedTarget,
        commission: formattedCommission,
        commissionAtTarget: formattedCommissionAtTarget || "AED 0",
        achievementBonus: formattedBonus || "AED 0",
        basicSalary: formattedSalary,
        joiningDate:
          formData.joiningDate ||
          new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        status: (formData.status as ManagedUser["status"]) || "Active",
      };
      setUsers((prev) => [newUser, ...prev]);
      toast({
        type: "success",
        title: "User Created",
        description: `${newUser.name} provisioned with ID ${newUser.id}.`,
      });
    }

    setIsFormOpen(false);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "ID",
          "Name",
          "Email",
          "Phone",
          "Role",
          "Department",
          "Joining Date",
          "Commission Slab",
          "Sales Target",
          "Commission",
          "Basic Salary",
          "Status",
        ].join(","),
        ...filteredUsers.map((u) =>
          [
            u.id,
            `"${u.name}"`,
            u.email,
            `"${u.phone}"`,
            `"${u.role}"`,
            `"${u.department}"`,
            `"${u.joiningDate}"`,
            `"${u.commissionSlab || "None"}"`,
            `"${u.salesTarget}"`,
            `"${u.commission}"`,
            `"${u.basicSalary || "AED 1,500"}"`,
            u.status,
          ].join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `next_crm_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      type: "success",
      title: "Data Exported",
      description: `Exported ${filteredUsers.length} user records to CSV.`,
    });
  };

  // Reusable DataTable Column Definitions
  const columns = React.useMemo<DataTableColumn<ManagedUser>[]>(() => [
    {
      id: "user",
      header: "USER",
      sortable: true,
      sortKey: "name",
      cell: ({ row }) => (
        <div
          onClick={() => { setProfileUser(row); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-2.5 cursor-pointer group select-none py-0.5"
          title={`Click to view ${row.name}'s profile`}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 shrink-0 border border-slate-600/50 shadow-sm group-hover:border-cyan-400 group-hover:ring-2 group-hover:ring-cyan-500/20 transition-all">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={row.avatar} alt={row.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div>
            <p className="font-semibold text-white text-xs sm:text-sm tracking-tight leading-tight group-hover:text-cyan-400 transition-colors underline-offset-2 group-hover:underline">
              {row.name}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      id: "email",
      header: "EMAIL",
      sortable: true,
      accessorKey: "email",
      cellClassName: "text-slate-200 text-xs sm:text-sm font-normal",
    },
    {
      id: "phone",
      header: "PHONE",
      sortable: true,
      accessorKey: "phone",
      cellClassName: "text-slate-200 text-xs sm:text-sm font-medium",
    },
    {
      id: "role",
      header: "ROLE",
      sortable: true,
      accessorKey: "role",
      cell: ({ row }) => (
        <>
          {row.role === "Admin" && (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold bg-[#0c314f] text-[#38bdf8] border border-[#0284c7]/40 shadow-sm inline-block">
              Admin
            </span>
          )}
          {row.role === "Sales Executive" && (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold bg-[#102754] text-[#60a5fa] border border-[#2563eb]/40 shadow-sm inline-block">
              Sales Executive
            </span>
          )}
          {row.role === "Marketing Executive" && (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold bg-[#2d124d] text-[#c084fc] border border-[#9333ea]/40 shadow-sm inline-block">
              Marketing Executive
            </span>
          )}
          {row.role === "Super Admin" && (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold bg-[#04283e] text-[#00c5ff] border border-[#026f9e] shadow-sm inline-block">
              Super Admin
            </span>
          )}
        </>
      ),
    },
    {
      id: "department",
      header: "DEPARTMENT",
      sortable: true,
      accessorKey: "department",
      cellClassName: "text-slate-200 text-xs sm:text-sm font-medium",
    },
    {
      id: "commissionSlab",
      header: "COMMISSION SLAB",
      sortable: true,
      sortKey: "commissionSlab",
      cell: ({ row }) => {
        const slab = row.commissionSlab || "None";
        if (slab === "Slab 3") {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Award className="w-3 h-3 text-amber-400" />
              Slab 3 (20%)
            </span>
          );
        }
        if (slab === "Slab 2") {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <Award className="w-3 h-3 text-cyan-400" />
              Slab 2 (15%)
            </span>
          );
        }
        if (slab === "Slab 1") {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
              <Award className="w-3 h-3 text-blue-400" />
              Slab 1 (10%)
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] text-slate-400 bg-slate-800/60 border border-slate-700/50">
            Exempt / None
          </span>
        );
      },
    },
    {
      id: "salesTarget",
      header: "SALES TARGET",
      sortable: true,
      accessorKey: "salesTarget",
      cellClassName: "text-white text-xs sm:text-sm font-semibold",
    },
    {
      id: "commission",
      header: "COMMISSION %",
      sortable: true,
      accessorKey: "commission",
      cellClassName: "text-emerald-400 text-xs sm:text-sm font-bold",
    },
    {
      id: "status",
      header: "STATUS",
      sortable: true,
      accessorKey: "status",
      cell: ({ row }) => (
        <>
          {row.status === "Active" ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              <span>Active</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold bg-rose-950/70 text-rose-400 border border-rose-500/40 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Inactive</span>
            </span>
          )}
        </>
      ),
    },
    {
      id: "action",
      header: "ACTION",
      align: "center",
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-1.5">
          <button
            onClick={() => setProfileUser(row)}
            className="p-1.5 rounded-md hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-400 transition-colors"
            title="View User Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEditForm(row)}
            className="p-1.5 rounded-md hover:bg-[#0c1a36] text-slate-300 hover:text-white transition-colors"
            title="Edit User"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(row.id)}
            className="p-1.5 rounded-md hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], [handleDeleteUser, handleOpenEditForm]);

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* ==================================================================== */}
      {/* 1. HEADER SECTION                                                    */}
      {/* ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {isFormOpen
              ? editingUser
                ? `Edit User: ${editingUser.name}`
                : "Create New User"
              : profileUser
              ? profileUser.name
              : "User Management"}
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mt-1">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              Dashboard
            </Link>
            <span>›</span>
            <span
              className={isFormOpen || profileUser ? "hover:text-cyan-400 cursor-pointer" : "text-white font-medium"}
              onClick={() => { isFormOpen && setIsFormOpen(false); profileUser && setProfileUser(null); }}
            >
              User Management
            </span>
            {isFormOpen && (
              <>
                <span>›</span>
                <span className="text-cyan-400 font-semibold">
                  {editingUser ? "Edit User" : "Create User"}
                </span>
              </>
            )}
            {profileUser && !isFormOpen && (
              <>
                <span>›</span>
                <span className="text-cyan-400 font-semibold">Profile</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={isFormOpen ? () => setIsFormOpen(false) : profileUser ? () => setProfileUser(null) : handleOpenCreateForm}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 active:scale-[0.98] ${isFormOpen || profileUser
              ? "bg-[#0c1a36] border border-[#1e386e] text-slate-200 hover:text-white hover:border-[#2a4a85] shadow-sm"
              : "bg-[#0092e0] hover:bg-[#0081c7] text-white shadow-[0_0_20px_rgba(0,146,224,0.4)]"
            }`}
        >
          {isFormOpen || profileUser ? (
            <>
              <ArrowLeft className="w-4 h-4" />
              <span>Back to List</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Create User</span>
            </>
          )}
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 2. FORM VIEW (IN-PAGE FULL SECTION WITH INCREASED SIZE & SLAB MATRIX) */}
      {/* ==================================================================== */}
      {isFormOpen ? (
        <div ref={formRef} className="animate-fade-in bg-[#091326] border border-[#16274e] rounded-2xl shadow-2xl overflow-hidden">
          {/* Form Header Banner */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#132347] bg-gradient-to-r from-[#070e1c] via-[#091326] to-[#070e1c]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0092e0]/15 border border-[#0092e0]/30 flex items-center justify-center text-[#00c5ff]">
                {editingUser ? <Pencil className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {editingUser ? "Edit User Details" : "Create New User Profile"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {editingUser
                    ? `Updating credentials & details for ${editingUser.id} — ${editingUser.name}`
                    : "Fill in personal credentials and organizational roles to manage user access."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#0e1a33] transition-colors shrink-0"
              aria-label="Close form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Main Body */}
          <form noValidate onSubmit={handleSaveUser} className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Profile Image Upload & Preview (Square) */}
              <div className="lg:col-span-4 xl:col-span-4 space-y-4">
                <div className="bg-[#070e1c] border border-[#16274e] rounded-2xl p-5 flex flex-col items-center text-center shadow-lg">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#132347] w-full">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Profile Image
                    </h3>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  {/* Square Image Container / Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative group w-48 h-48 sm:w-56 sm:h-56 aspect-square rounded-2xl overflow-hidden border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer shadow-inner ${
                      isDragging
                        ? "border-cyan-400 bg-cyan-950/40 ring-4 ring-cyan-500/20"
                        : formData.avatar
                        ? "border-[#1e386e] hover:border-cyan-400 bg-[#050b17]"
                        : "border-[#1b315b] hover:border-cyan-500/70 bg-[#060d1d]"
                    }`}
                  >
                    {formData.avatar ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.avatar}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#070e1c]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 backdrop-blur-xs text-white">
                          <Camera className="w-6 h-6 text-cyan-400" />
                          <span className="text-xs font-semibold text-slate-100">Change Photo</span>
                          <span className="text-[10px] text-slate-400">Click to choose another</span>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-[#0092e0]/10 border border-[#0092e0]/25 flex items-center justify-center text-[#00c5ff] mb-3 group-hover:scale-105 group-hover:bg-[#0092e0]/20 transition-all">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-200">
                          Upload User Photo
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                          Drag &amp; drop or click to browse
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#0092e0]/15 hover:bg-[#0092e0]/25 text-[#00c5ff] border border-[#0092e0]/40 transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.avatar ? "Change Photo" : "Upload Photo"}</span>
                    </button>

                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="w-full py-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>

                  {/* Guidelines info */}
                  <div className="mt-4 pt-3 border-t border-[#132347] w-full text-[11px] text-slate-400 space-y-1">
                    <p className="flex items-center justify-between">
                      <span>Format</span>
                      <span className="font-medium text-slate-300">PNG, JPG, WebP</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Ratio / Size</span>
                      <span className="font-medium text-slate-300">1:1 Square (Max 5MB)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Form Inputs Re-arranged */}
              <div className="lg:col-span-8 xl:col-span-8 space-y-6">
                {/* SECTION 1: Personal & Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#132347]">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                      1. Personal &amp; Contact Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        onBlur={() => handleFieldBlur("name")}
                        placeholder="e.g. Tariq Mansoor"
                        className={`w-full bg-[#070e1c] border rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors text-sm ${
                          formErrors.name
                            ? "border-rose-500/80 bg-rose-950/15 focus:border-rose-500 ring-1 ring-rose-500/20"
                            : touchedFields.name && formData.name?.trim()
                            ? "border-emerald-500/50 focus:border-emerald-400"
                            : "border-[#142344] focus:border-cyan-500"
                        }`}
                      />
                      {formErrors.name && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 font-medium animate-fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        onBlur={() => handleFieldBlur("email")}
                        placeholder="e.g. tariq.m@next.com"
                        className={`w-full bg-[#070e1c] border rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors text-sm ${
                          formErrors.email
                            ? "border-rose-500/80 bg-rose-950/15 focus:border-rose-500 ring-1 ring-rose-500/20"
                            : touchedFields.email && formData.email?.trim()
                            ? "border-emerald-500/50 focus:border-emerald-400"
                            : "border-[#142344] focus:border-cyan-500"
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 font-medium animate-fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                        Dubai / UAE Phone Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.phone || ""}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        onBlur={() => handleFieldBlur("phone")}
                        placeholder="e.g. +971 50 123 4567 or 050 123 4567"
                        className={`w-full bg-[#070e1c] border rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors text-sm ${
                          formErrors.phone
                            ? "border-rose-500/80 bg-rose-950/15 focus:border-rose-500 ring-1 ring-rose-500/20"
                            : touchedFields.phone && formData.phone?.trim()
                            ? "border-emerald-500/50 focus:border-emerald-400"
                            : "border-[#142344] focus:border-cyan-500"
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 font-medium animate-fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Account Credentials & Access Password */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#132347]">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Account Credentials &amp; Access Password
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                        Password {editingUser ? <span className="text-slate-400 text-xs font-normal">(Leave blank to keep unchanged)</span> : <span className="text-rose-400">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password || ""}
                          onChange={(e) => handleFieldChange("password", e.target.value)}
                          onBlur={() => handleFieldBlur("password")}
                          placeholder={editingUser ? "•••••••• (Leave blank to keep existing)" : "Min 8 characters (letters & numbers)"}
                          className={`w-full bg-[#070e1c] border rounded-xl pl-4 pr-11 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors text-sm ${
                            formErrors.password
                              ? "border-rose-500/80 bg-rose-950/15 focus:border-rose-500 ring-1 ring-rose-500/20"
                              : touchedFields.password && formData.password
                              ? "border-emerald-500/50 focus:border-emerald-400"
                              : "border-[#142344] focus:border-cyan-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formErrors.password && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 font-medium animate-fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {formErrors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                        Confirm Password {editingUser ? <span className="text-slate-400 text-xs font-normal">(Only if changing password)</span> : <span className="text-rose-400">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword || ""}
                          onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                          onBlur={() => handleFieldBlur("confirmPassword")}
                          placeholder="Re-enter password to confirm"
                          className={`w-full bg-[#070e1c] border rounded-xl pl-4 pr-11 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors text-sm ${
                            formErrors.confirmPassword
                              ? "border-rose-500/80 bg-rose-950/15 focus:border-rose-500 ring-1 ring-rose-500/20"
                              : touchedFields.confirmPassword && formData.confirmPassword && formData.confirmPassword === formData.password
                              ? "border-emerald-500/50 focus:border-emerald-400"
                              : "border-[#142344] focus:border-cyan-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formErrors.confirmPassword && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 font-medium animate-fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {formErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Department & Status Assignment */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#132347]">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                      2. Department &amp; Status
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                        Department <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.department || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              "department",
                              e.target.value as ManagedUser["department"]
                            )
                          }
                          onBlur={() => handleFieldBlur("department")}
                          className={`w-full bg-[#070e1c] border rounded-xl px-4 py-3 text-slate-100 appearance-none focus:outline-none transition-colors text-sm cursor-pointer ${
                            formErrors.department
                              ? "border-rose-500/80 bg-rose-950/15 focus:border-rose-500 ring-1 ring-rose-500/20"
                              : "border-[#142344] focus:border-cyan-500"
                          }`}
                        >
                          <option value="">Select Department...</option>
                          <option value="Sales">Sales</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Administration">Administration</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {formErrors.department && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 font-medium animate-fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {formErrors.department}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                        Account Status <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.status || "Active"}
                          onChange={(e) =>
                            handleFieldChange(
                              "status",
                              e.target.value as ManagedUser["status"]
                            )
                          }
                          onBlur={() => handleFieldBlur("status")}
                          className={`w-full bg-[#070e1c] border rounded-xl px-4 py-3 text-slate-100 appearance-none focus:outline-none transition-colors text-sm cursor-pointer ${
                            formErrors.status
                              ? "border-rose-500/80 bg-rose-950/15 focus:border-rose-500 ring-1 ring-rose-500/20"
                              : "border-[#142344] focus:border-cyan-500"
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {formErrors.status && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 font-medium animate-fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {formErrors.status}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* FORM FOOTER CONTROLS */}
            <div className="pt-6 border-t border-[#132347] flex flex-col-reverse sm:flex-row items-center justify-end gap-3.5">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#17274c] text-slate-300 hover:text-white hover:border-slate-500 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0092e0] hover:bg-[#0081c7] text-white text-sm font-bold shadow-[0_0_20px_rgba(0,146,224,0.45)] transition-all active:scale-[0.98]"
              >
                {editingUser ? "Save User Changes" : "Create & Provision User"}
              </button>
            </div>
          </form>
        </div>
      ) : profileUser ? (
        /* ==================================================================== */
        /* 3. PROFILE VIEW — STREAMLINED, MODERN & ATTRACTIVE                   */
        /* ==================================================================== */
        <div className="animate-fade-in rounded-2xl overflow-hidden shadow-2xl border border-[#16274e] bg-[#070e1d]">

          {/* ══ 1. UNIFIED EXECUTIVE PROFILE & CONTACT HEADER ══ */}
          <div className="relative overflow-hidden bg-gradient-to-b from-[#0c1a36] via-[#09142b] to-[#070e1d] border-b border-[#142347] p-6 sm:p-8">
            <div className="absolute top-0 right-1/4 w-96 h-48 bg-sky-500/10 blur-3xl pointer-events-none" />

            {/* Top Navigation Row */}
            <div className="relative flex items-center justify-between pb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProfileUser(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a152d] hover:bg-[#102044] border border-[#172b57] text-slate-300 hover:text-white text-xs font-medium transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Users</span>
                </button>
                <span className="text-slate-600 text-xs hidden sm:inline">/</span>
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">User Profile</span>
              </div>
              <button
                onClick={() => { handleOpenEditForm(profileUser); setProfileUser(null); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0092e0] hover:bg-[#0081c7] text-white text-xs font-bold shadow-lg shadow-sky-500/25 transition-all active:scale-[0.98]"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Profile Identity & Direct Contact Grid */}
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Identity Left */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-sky-500/30 bg-[#0c1830] shadow-xl ring-4 ring-sky-500/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profileUser.avatar}
                      alt={profileUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#070e1d] ${
                      profileUser.status === "Active" ? "bg-emerald-400" : "bg-rose-400"
                    }`}
                    title={profileUser.status}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                      {profileUser.name}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        profileUser.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${profileUser.status === "Active" ? "bg-emerald-400" : "bg-rose-400"}`} />
                      {profileUser.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mb-2.5">
                    <span className="font-semibold text-sky-400">{profileUser.role}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{profileUser.department}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleCopyId(profileUser.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0b1733] hover:bg-[#12234c] border border-[#162b57] text-slate-300 hover:text-white transition-colors text-xs font-mono"
                      title="Click to copy ID"
                    >
                      <span>{profileUser.id}</span>
                      {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0b1733] border border-[#162b57] text-slate-400 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Joined {profileUser.joiningDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Quick Contact Hub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 lg:w-auto shrink-0">
                <a
                  href={`mailto:${profileUser.email}`}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#09142b]/80 hover:bg-[#0e1d3e] border border-[#142347] hover:border-sky-500/40 transition-all group"
                  title="Send Email"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 pr-1">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                      {profileUser.email}
                    </p>
                  </div>
                </a>

                <a
                  href={`tel:${profileUser.phone}`}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#09142b]/80 hover:bg-[#0e1d3e] border border-[#142347] hover:border-sky-500/40 transition-all group"
                  title="Call User"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 pr-1">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                      {profileUser.phone}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* ══ 2. COMMISSION SLABS & TARGET PERFORMANCE ══ */}
          <div className="p-6 sm:p-8 space-y-6 bg-[#070e1d]">
            {(() => {
              // Always default starting slab to "Slab 1" (Ongoing) as the baseline
              const currentSlab = (profileUser.commissionSlab && profileUser.commissionSlab !== "None") ? profileUser.commissionSlab : "Slab 1";
              const currentLevel =
                currentSlab === "Slab 3"
                  ? 3
                  : currentSlab === "Slab 2"
                  ? 2
                  : 1;

              // Parse monthly target for the current active slab
              const targetAmount =
                parseInt((profileUser.salesTarget || "").replace(/[^0-9]/g, ""), 10) ||
                (currentLevel === 3 ? 50000 : currentLevel === 2 ? 30000 : 15000);

              // Parse actual sales achieved by the user
              const achievedAmount = profileUser.salesAchieved
                ? parseInt(profileUser.salesAchieved.replace(/[^0-9]/g, ""), 10)
                : (currentLevel === 3 ? 42500 : currentLevel === 2 ? 22500 : 10500);

              // Dynamic percentage of target achieved
              const achievementPercentage =
                targetAmount > 0
                  ? Math.round((achievedAmount / targetAmount) * 100)
                  : 0;

              const clampedPercentage = Math.min(100, Math.max(0, achievementPercentage));
              const remainingAmount = Math.max(0, targetAmount - achievedAmount);
              const isTargetAchieved = achievementPercentage >= 100;

              const commissionRate = currentLevel === 3 ? 20 : currentLevel === 2 ? 15 : 10;
              const commissionEarned = Math.round((achievedAmount * (commissionRate / 100)));
              const bonusAmount = currentLevel === 3 ? 2000 : currentLevel === 2 ? 1500 : 1000;
              const basicSalary = 1500;
              const totalPotential = Math.round(targetAmount * (commissionRate / 100)) + bonusAmount + basicSalary;

              return (
                <div className="space-y-5">
                  {/* Performance Hub Header & Stage Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-sky-400" />
                        <h3 className="text-sm font-bold text-white tracking-wide">
                          Commission Slabs &amp; Performance
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                          Level {currentLevel} · {currentSlab}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Tier progression starts at Slab 1. Reach monthly sales targets to unlock higher commissions.
                      </p>
                    </div>

                    {/* Stage Selector Pills */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-[#09142b] border border-[#142347] self-start sm:self-auto">
                      <span className="text-[11px] font-semibold text-slate-400 px-2">Stage:</span>
                      {(["Slab 1", "Slab 2", "Slab 3"] as const).map((slabOption) => {
                        const isSelected = currentSlab === slabOption;
                        return (
                          <button
                            key={slabOption}
                            type="button"
                            onClick={() => handleUpdateUserSlab(slabOption)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-[#0092e0] text-white shadow-md shadow-sky-500/30"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {slabOption === "Slab 1" ? "Slab 1 (Start)" : slabOption}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hero Target Achievement & Performance Console */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#0c1a36] via-[#09142b] to-[#070e1d] border border-[#172b55] p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-5">
                    <div className="absolute top-0 right-0 w-80 h-36 bg-sky-500/10 blur-3xl pointer-events-none" />

                    {/* Key Metrics Cards (4 Focused Cards) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Target Card */}
                      <div className="p-3.5 rounded-xl bg-[#09142b]/90 border border-[#162952]">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Monthly Target</p>
                        <p className="text-base sm:text-lg font-black text-white font-mono">
                          AED {targetAmount.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{currentSlab} Goal</p>
                      </div>

                      {/* Achieved Card */}
                      <div className={`p-3.5 rounded-xl border ${
                        isTargetAchieved
                          ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-400"
                          : "bg-[#09142b]/90 border-[#162952]"
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Sales Achieved</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isTargetAchieved ? "bg-emerald-500/20 text-emerald-300" : "bg-sky-500/20 text-sky-300"
                          }`}>
                            {achievementPercentage}%
                          </span>
                        </div>
                        <p className={`text-base sm:text-lg font-black font-mono ${isTargetAchieved ? "text-emerald-400" : "text-sky-400"}`}>
                          AED {achievedAmount.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isTargetAchieved ? "Target Met! 🎉" : `AED ${remainingAmount.toLocaleString()} left`}
                        </p>
                      </div>

                      {/* Commission Earned Card */}
                      <div className="p-3.5 rounded-xl bg-[#09142b]/90 border border-[#162952]">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Commission</p>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300">
                            {commissionRate}%
                          </span>
                        </div>
                        <p className="text-base sm:text-lg font-black text-sky-400 font-mono">
                          AED {commissionEarned.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Calculated on sales</p>
                      </div>

                      {/* Total Potential at Target Card */}
                      <div className="p-3.5 rounded-xl bg-[#09142b]/90 border border-[#162952]">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Potential Earnings</p>
                        <p className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                          AED {totalPotential.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Incl. AED {bonusAmount.toLocaleString()} bonus
                        </p>
                      </div>
                    </div>

                    {/* Target Progress Bar & Interactive Simulator */}
                    <div className="bg-[#060e1d] p-4 rounded-xl border border-[#142347] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-sky-400" />
                          <span className="font-bold text-white">Target Achievement Progress</span>
                          {isTargetAchieved ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Met ({achievementPercentage}%)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                              {achievementPercentage}%
                            </span>
                          )}
                        </div>
                        <div className="text-slate-300 font-mono">
                          <span className="font-bold text-white">AED {achievedAmount.toLocaleString()}</span>
                          <span className="text-slate-400"> / AED {targetAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Progress Track */}
                      <div className="relative w-full bg-[#030712] rounded-full h-3 border border-[#16284f] overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            isTargetAchieved
                              ? "bg-gradient-to-r from-emerald-500 to-teal-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                              : "bg-gradient-to-r from-[#0092e0] via-[#00c5ff] to-[#10b981] shadow-[0_0_12px_rgba(0,197,255,0.45)]"
                          }`}
                          style={{ width: `${Math.max(clampedPercentage, achievementPercentage > 0 ? 3 : 0)}%` }}
                        />
                      </div>

                      {/* Clean Milestones */}
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>0%</span>
                        <span className={achievementPercentage >= 25 ? "text-sky-300 font-semibold" : ""}>25%</span>
                        <span className={achievementPercentage >= 50 ? "text-sky-300 font-semibold" : ""}>50%</span>
                        <span className={achievementPercentage >= 75 ? "text-sky-300 font-semibold" : ""}>75%</span>
                        <span className={isTargetAchieved ? "text-emerald-400 font-bold" : ""}>100% (AED {targetAmount.toLocaleString()})</span>
                      </div>

                      {/* Quick Adjust & Simulator Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#132347]">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Adjust:</span>
                          {[0.25, 0.5, 0.75, 1.0].map((ratio) => {
                            const val = Math.round(targetAmount * ratio);
                            const pct = Math.round(ratio * 100);
                            const isCurrent = Math.abs(achievedAmount - val) < 50;
                            return (
                              <button
                                key={ratio}
                                type="button"
                                onClick={() => handleUpdateAchievedSales(val)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  isCurrent
                                    ? "bg-[#0092e0] text-white shadow-sm shadow-sky-500/40"
                                    : "bg-[#0a152e] hover:bg-[#12234c] text-slate-300 hover:text-white border border-[#162b57]"
                                }`}
                              >
                                {pct}%
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom AED Input */}
                        <div className="flex items-center gap-1.5">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold pointer-events-none">
                              AED
                            </span>
                            <input
                              type="number"
                              placeholder={achievedAmount.toString()}
                              value={customAchievedInput}
                              onChange={(e) => setCustomAchievedInput(e.target.value)}
                              className="w-28 pl-10 pr-2 py-1 rounded-lg bg-[#070e1c] border border-[#162b57] text-white text-xs font-mono focus:outline-none focus:border-sky-400"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const parsed = parseInt(customAchievedInput, 10);
                              if (!isNaN(parsed) && parsed >= 0) {
                                handleUpdateAchievedSales(parsed);
                                setCustomAchievedInput("");
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-[#0092e0] hover:bg-[#0081c7] text-white text-xs font-bold transition-colors"
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Celebration / Unlock Advance Banner */}
                    {isTargetAchieved && (
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-[#06241a] border border-emerald-500/40 text-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white">
                              Monthly Target 100% Achieved! (+AED {bonusAmount.toLocaleString()} Bonus Unlocked)
                            </p>
                            <p className="text-emerald-300/80 text-xs">
                              Commission earned: AED {commissionEarned.toLocaleString()}.
                              {currentLevel < 3 && ` User is qualified to advance to Slab ${currentLevel + 1}!`}
                            </p>
                          </div>
                        </div>
                        {currentLevel < 3 && (
                          <button
                            type="button"
                            onClick={() => handleUpdateUserSlab(currentLevel === 1 ? "Slab 2" : "Slab 3")}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                          >
                            <span>Advance to Slab {currentLevel + 1}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 3 Slab Tiers Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {COMMISSION_SLABS_CONFIG.map((tier) => {
                      const isAchieved = currentLevel > tier.level;
                      const isOngoing = currentLevel === tier.level;
                      const isLocked = currentLevel < tier.level;

                      return (
                        <div
                          key={tier.id}
                          className={`rounded-2xl border p-5 transition-all flex flex-col justify-between relative overflow-hidden ${
                            isOngoing
                              ? "bg-[#091a38] border-sky-400/90 shadow-[0_0_25px_rgba(0,146,224,0.2)] ring-1 ring-sky-400/40"
                              : isAchieved
                              ? "bg-[#061814] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                              : "bg-[#060c18] border-[#121f3d] opacity-75 hover:opacity-90"
                          }`}
                        >
                          <div>
                            {/* Card Header */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLocked ? "text-slate-500" : "text-slate-400"}`}>
                                  {tier.badgeLabel}
                                </span>
                                <h4 className={`text-base font-bold tracking-tight ${isLocked ? "text-slate-300" : "text-white"}`}>
                                  {tier.name}
                                </h4>
                              </div>

                              {isOngoing ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/50">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                                  Ongoing
                                </span>
                              ) : isAchieved ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  Achieved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/50 text-slate-500 border border-slate-800">
                                  <Lock className="w-3 h-3 text-slate-500" />
                                  Locked
                                </span>
                              )}
                            </div>

                            {/* Monthly Target & Commission Banner */}
                            <div className={`rounded-xl border p-3 mb-4 flex items-center justify-between ${
                              isOngoing
                                ? "bg-[#051124] border-sky-500/30"
                                : isAchieved
                                ? "bg-[#04120e] border-emerald-500/20"
                                : "bg-[#040813] border-slate-800/60"
                            }`}>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Target</p>
                                <p className={`text-base font-extrabold ${isLocked ? "text-slate-300" : "text-white"}`}>
                                  {tier.monthlyTargetFormatted}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Commission</p>
                                <p className={`text-base font-extrabold ${
                                  isOngoing ? "text-sky-400" : isAchieved ? "text-emerald-400" : "text-slate-400"
                                }`}>
                                  {tier.commissionRateFormatted}
                                </p>
                              </div>
                            </div>

                            {/* Breakdown List */}
                            <div className="space-y-2 text-xs mb-4">
                              <div className="flex items-center justify-between py-1 border-b border-[#142347]">
                                <span className="text-slate-400">Commission at Target:</span>
                                <span className="font-semibold text-slate-200">{tier.commissionAtTargetFormatted}</span>
                              </div>
                              <div className="flex items-center justify-between py-1 border-b border-[#142347]">
                                <span className="text-slate-400">Achievement Bonus:</span>
                                <span className="font-semibold text-emerald-400">{tier.achievementBonusFormatted}</span>
                              </div>
                              <div className="flex items-center justify-between py-1 border-b border-[#142347]">
                                <span className="text-slate-400">Basic Salary:</span>
                                <span className="font-semibold text-slate-200">{tier.basicSalaryFormatted}</span>
                              </div>
                              <div className="flex items-center justify-between pt-1 font-bold">
                                <span className="text-slate-300">Total Potential:</span>
                                <span className={isOngoing ? "text-sky-300" : isAchieved ? "text-emerald-300" : "text-slate-400"}>
                                  AED {(
                                    tier.monthlyTarget * (tier.commissionRate / 100) +
                                    (tier.level === 1 ? 1000 : tier.level === 2 ? 1500 : 2000) +
                                    1500
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          {isOngoing ? (
                            <div className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#0092e0] text-white shadow-md shadow-sky-500/25 flex items-center justify-center gap-1.5 cursor-default">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Current Active Tier</span>
                            </div>
                          ) : isAchieved ? (
                            <div className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-1.5 cursor-default">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Completed</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateUserSlab(tier.id)}
                              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-[#0a152d] hover:bg-[#12234c] text-slate-300 hover:text-white border border-[#162b57] transition-all flex items-center justify-center gap-1.5"
                            >
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                              <span>Unlock Slab</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Policy Footnote */}
                  <div className="p-3 rounded-xl bg-[#09142b]/60 border border-[#142347] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span>
                      <strong className="text-slate-300">Policy:</strong> Commission at target = Monthly Sales Target × Rate. Bonus unlocked at 100% target.
                    </span>
                    <span className="text-slate-500">
                      Standard Basic Salary: AED 1,500
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ══ FOOTER ACTION BAR ══ */}
          <div className="px-6 sm:px-8 py-4 bg-[#060c18] border-t border-[#132347] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Account managed by Admin · Last updated {profileUser.joiningDate}
            </p>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setProfileUser(null)}
                className="px-4 py-2 rounded-xl border border-[#172b57] bg-[#09142b] hover:bg-[#102044] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                Back to List
              </button>
              <button
                onClick={() => { handleOpenEditForm(profileUser); setProfileUser(null); }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0092e0] hover:bg-[#0081c7] text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all active:scale-[0.98]"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

      ) : (
        /* TABLE VIEW */
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 w-full">
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shrink-0"><Users className="w-4 h-4" /></div>
                <span className="text-xs font-semibold text-slate-300 truncate">Total Users</span>
              </div>
              <div className="mt-2.5"><span className="text-xl font-bold text-white">{USER_STATS.totalUsers}</span><p className="text-[11px] text-slate-500 mt-0.5">{USER_STATS.totalUsersTrend}</p></div>
            </div>
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0"><UserCheck className="w-4 h-4" /></div>
                <span className="text-xs font-semibold text-slate-300 truncate">Active</span>
              </div>
              <div className="mt-2.5"><span className="text-xl font-bold text-emerald-400">{USER_STATS.activeUsers}</span><p className="text-[11px] text-slate-500 mt-0.5">{USER_STATS.activeUsersPct}</p></div>
            </div>
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-700 text-white flex items-center justify-center shrink-0"><UserX className="w-4 h-4" /></div>
                <span className="text-xs font-semibold text-slate-300 truncate">Inactive</span>
              </div>
              <div className="mt-2.5"><span className="text-xl font-bold text-rose-400">{USER_STATS.inactiveUsers}</span><p className="text-[11px] text-slate-500 mt-0.5">{USER_STATS.inactiveUsersPct}</p></div>
            </div>
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0"><UserPlus className="w-4 h-4" /></div>
                <span className="text-xs font-semibold text-slate-300 truncate">New</span>
              </div>
              <div className="mt-2.5"><span className="text-xl font-bold text-violet-400">{USER_STATS.newUsers}</span><p className="text-[11px] text-slate-500 mt-0.5">{USER_STATS.newUsersTrend}</p></div>
            </div>
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0"><Building2 className="w-4 h-4" /></div>
                <span className="text-xs font-semibold text-slate-300 truncate">Departments</span>
              </div>
              <div className="mt-2.5"><span className="text-xl font-bold text-amber-400">{USER_STATS.departmentsCount}</span><p className="text-[11px] text-slate-500 mt-0.5">Active departments</p></div>
            </div>
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center shrink-0"><Shield className="w-4 h-4" /></div>
                <span className="text-xs font-semibold text-slate-300 truncate">Roles</span>
              </div>
              <div className="mt-2.5"><span className="text-xl font-bold text-cyan-400">{USER_STATS.rolesCount}</span><p className="text-[11px] text-slate-500 mt-0.5">Permission levels</p></div>
            </div>
          </div>

          <div className="bg-[#091326] border border-[#132347] rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input type="text" placeholder="Search by name, email, or ID..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full bg-[#070e1c] border border-[#142344] focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors text-sm" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select value={selectedRole} onChange={(e) => { setSelectedRole(e.target.value); setCurrentPage(1); }} className="appearance-none bg-[#070e1c] border border-[#142344] focus:border-cyan-500 rounded-xl pl-3 pr-8 py-2.5 text-slate-200 focus:outline-none text-xs cursor-pointer">
                  <option value="ALL">All Roles</option><option value="Admin">Admin</option><option value="Super Admin">Super Admin</option><option value="Sales Executive">Sales Executive</option><option value="Marketing Executive">Marketing Executive</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="relative">
                <select value={selectedDepartment} onChange={(e) => { setSelectedDepartment(e.target.value); setCurrentPage(1); }} className="appearance-none bg-[#070e1c] border border-[#142344] focus:border-cyan-500 rounded-xl pl-3 pr-8 py-2.5 text-slate-200 focus:outline-none text-xs cursor-pointer">
                  <option value="ALL">All Departments</option><option value="Administration">Administration</option><option value="Sales">Sales</option><option value="Marketing">Marketing</option><option value="Finance">Finance</option><option value="Operations">Operations</option><option value="Design">Design</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="relative">
                <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }} className="appearance-none bg-[#070e1c] border border-[#142344] focus:border-cyan-500 rounded-xl pl-3 pr-8 py-2.5 text-slate-200 focus:outline-none text-xs cursor-pointer">
                  <option value="ALL">All Status</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {(searchQuery || selectedRole !== "ALL" || selectedDepartment !== "ALL" || selectedStatus !== "ALL") && (
                <button onClick={() => { setSearchQuery(""); setSelectedRole("ALL"); setSelectedDepartment("ALL"); setSelectedStatus("ALL"); setCurrentPage(1); }} className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#1e386e] text-slate-300 hover:text-white text-xs font-semibold transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />Reset
                </button>
              )}
            </div>
          </div>

          <DataTable
            data={paginatedUsers}
            columns={columns}
            getRowId={(row) => row.id}
            sortField={sortField}
            sortAsc={sortAsc}
            onSort={(field) => { if (sortField === field) setSortAsc(!sortAsc); else { setSortField(field as keyof ManagedUser); setSortAsc(true); } }}
            selectedIds={selectedUserIds}
            onSelectAll={() => setSelectedUserIds(paginatedUsers.map((u) => u.id))}
            onSelectRow={(id) => setSelectedUserIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])}
            pageSize={pageSize}
            onPageSizeChange={(newSize) => { setPageSize(newSize); setCurrentPage(1); }}
            onExport={handleExport}
            pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={filteredUsers.length}
            onPageChange={(page) => setCurrentPage(page)}
            emptyMessage="No users found matching your filter criteria."
            minWidth="1040px"
          />
        </>
      )}
    </div>
  );
}
