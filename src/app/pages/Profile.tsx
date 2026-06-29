import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Edit3,
  FileText,
  Lock,
  Mail,
  Save,
  TrendingUp,
  Upload,
  User,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge, Btn, Input, Textarea } from "../components/ui/UI";
import { cn } from "../components/ui/utils";
import { setUser } from "../../slices/UserSlice";

interface Stats {
  notesCount  : number ,
  completedNotesCount : number ,
  pendingNotesCount : number ,
  tasksCount : number ,
  completedTasksCount : number ,
  pendingTasksCount : number ,
}


function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null) ;
  const [passwordLoading, setPasswordLoading] = useState(false);
  const token = useSelector((state : any) => state.user.token ) ;


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/statistics",
          {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(data);
        console.log("User stats:", data);

      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      }
    }

    fetchStats();
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const profileStats = [
    {
      label: "Notes",
      value: stats?.notesCount || "0",
      icon: FileText,
      color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      label: "Tasks",
      value: stats?.tasksCount || "0",
      icon: CheckCircle2,
      color: "text-green-500 bg-green-50 dark:bg-green-950/40",
    },
    {
      label: "completed Tasks",
      value: stats?.completedTasksCount || "0",
      icon: Zap,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
    },
    {
      label: "prnding Notes",
      value: stats?.pendingNotesCount || "0%",
      icon: TrendingUp,
      color: "text-violet-500 bg-violet-50 dark:bg-violet-950/40",
    },
  ];

  const handleSave = async () => {
    try {
      setSaving(true);

      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          name,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setUser(data));

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPw.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setPasswordLoading(true);

      await axios.put(
        "http://localhost:5000/api/users/change-password",
        {
          currentPassword: currentPw,
          newPassword: newPw,
        },
        {
            headers : {
                 Authorization : `Bearer ${token}`
            }
        }
      );

      setCurrentPw("");
      setNewPw("");

      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

    const helndelImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setUser(data ));
      
      toast.success("Profile image updated successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to upload image"
      );
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {profileStats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-5 text-center"
            >
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3",
                  item.color
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="text-2xl font-bold">{item.value}</h3>

              <p className="text-sm text-muted-foreground">
                {item.label}
              </p>
            </motion.div>
          );
        })}
      </div>
      <div className="imagePreview">
        <img
          src={user.image || "/default-profile.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <input
          type="file"
          accept="image/*"
          onChange={helndelImage}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
        />

      </div>
  

      {/* Content */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Personal Information */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-5">
            Personal Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <Input
                value={name}
                onChange={setName}
                placeholder="Your Name"
                icon={<User className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email Address
              </label>

              <Input
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
              />
            </div>



            <Btn
              variant="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </Btn>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-5">
            Change Password
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">
                Current Password
              </label>

              <Input
                type="password"
                value={currentPw}
                onChange={setCurrentPw}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                New Password
              </label>

              <Input
                type="password"
                value={newPw}
                onChange={setNewPw}
                placeholder="Minimum 8 characters"
                icon={<Lock className="w-4 h-4" />}
              />
            </div>

            <Btn
              variant="outline"
              onClick={handleUpdatePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                "Update Password"
              )}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;