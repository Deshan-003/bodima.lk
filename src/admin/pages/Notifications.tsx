import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  CheckCircle2,
  Info,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useAdminData } from "../data/store";
import type { AdminNotification } from "../data/types";
import { useToast } from "../components/ui";
import {
  Badge,
  EmptyState,
  PageHeader,
  SectionCard,
  SelectField,
  cx,
  primaryBtn,
  secondaryBtn,
} from "../components/ui";

const toneStyles: Record<AdminNotification["tone"], { icon: LucideIcon; className: string; label: string }> = {
  info: { icon: Info, className: "bg-blue-50 text-blue-700", label: "Info" },
  warning: { icon: AlertTriangle, className: "bg-[#FFF3D6] text-[#97650B]", label: "Warning" },
  success: { icon: CheckCircle2, className: "bg-[#DFF2E4] text-[#1F7A3D]", label: "Success" },
};

export default function Notifications() {
  const { data, markNotificationRead, markAllNotificationsRead } = useAdminData();
  const toast = useToast();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notifications = data.notifications;
  const unread = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);
  const visible = useMemo(
    () => (filter === "all" ? notifications : notifications.filter((item) => !item.read)),
    [notifications, filter],
  );

  function markAll() {
    if (unread === 0) {
      toast.info("All notifications are already read.");
      return;
    }
    markAllNotificationsRead();
    toast.success(`${unread} notification${unread === 1 ? "" : "s"} marked as read.`);
  }

  function markOne(item: AdminNotification) {
    markNotificationRead(item.id);
    toast.success("Notification marked as read.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="System alerts and activity that need your attention."
        actions={
          <>
            <Link to="/admin/settings?tab=notifications" className={secondaryBtn}>
              <Settings size={16} /> Notification preferences
            </Link>
            <button type="button" className={primaryBtn} onClick={markAll}>
              <CheckCheck size={16} /> Mark all as read
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="red">
          <Bell size={13} /> {unread} unread
        </Badge>
        <Badge tone="gray">{notifications.length} total</Badge>
      </div>

      <SectionCard
        title="Recent notifications"
        subtitle={`${visible.length} shown`}
        action={
          <SelectField
            value={filter}
            onChange={(value) => setFilter(value as "all" | "unread")}
            ariaLabel="Filter notifications"
            options={[
              { value: "all", label: "All notifications" },
              { value: "unread", label: "Unread only" },
            ]}
            className="w-[180px]"
          />
        }
      >
        {visible.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title={filter === "unread" ? "No unread notifications" : "No notifications"}
            description={
              filter === "unread"
                ? "You are all caught up. Switch to all notifications to see your history."
                : "There are no notifications to display right now."
            }
            action={
              filter === "unread" ? (
                <button type="button" className={secondaryBtn} onClick={() => setFilter("all")}>
                  Show all notifications
                </button>
              ) : undefined
            }
          />
        ) : (
          <ul className="divide-y divide-primary-50">
            {visible.map((item) => {
              const { icon: Icon, className, label } = toneStyles[item.tone];
              return (
                <li
                  key={item.id}
                  className={cx("flex flex-wrap items-start gap-3 px-5 py-4 sm:px-6", !item.read && "bg-lav/30")}
                >
                  <span className={cx("grid h-10 w-10 shrink-0 place-items-center rounded-xl", className)}>
                    <Icon size={19} strokeWidth={2.3} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {!item.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary-700" aria-label="Unread" />}
                      <p className={cx("text-[14px] text-night", item.read ? "font-bold" : "font-extrabold")}>
                        {item.title}
                      </p>
                      <Badge tone={item.tone === "warning" ? "amber" : item.tone === "success" ? "green" : "blue"}>
                        {label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-[13px] font-medium leading-relaxed text-night/60">{item.body}</p>
                    <p className="mt-1 text-[12px] font-medium text-night/40">{item.time}</p>
                  </div>
                  {!item.read && (
                    <button type="button" className={secondaryBtn} onClick={() => markOne(item)}>
                      <Check size={15} /> Mark as read
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
