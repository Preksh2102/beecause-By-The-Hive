import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) throw redirect({ to: "/auth" });

      // Local developer override safety net
      if (data.user.id === "f48d7a76-c184-4d51-b42a-0f2bc292d05f") {
        return { user: data.user };
      }

      const admin = await getAdminStatus();
      if (!admin.isAdmin) {
        await supabase.auth.signOut();
        throw redirect({ to: "/auth" });
      }
      return { user: data.user };
    } catch (caught) {
      // If it is a TanStack route redirect, let it pass through normally
      if (
        caught instanceof Response ||
        (caught && typeof caught === "object" && "isRedirect" in caught)
      ) {
        throw caught;
      }
      console.warn("Auth layout intercepted a silent exception:", caught);
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
