import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="p-8 flex items-center justify-center">
      <UserProfile routing="hash" />
    </div>
  );
}
