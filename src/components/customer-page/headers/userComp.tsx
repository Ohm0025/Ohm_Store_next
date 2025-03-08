"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";
import { useSignout } from "@/hooks/useSignout";
import { Loader2 } from "lucide-react";
import { UserType } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface UserCompProps {
  user: UserType;
}

export const AuthBtn = () => (
  <div className="flex justify-center gap-3">
    <Button size="lg" asChild>
      <SheetClose asChild>
        <Link href="/auth/signup">Register</Link>
      </SheetClose>
    </Button>
    <Button variant="outline" size="lg" asChild>
      <SheetClose asChild>
        <Link href="/auth/signin">Login</Link>
      </SheetClose>
    </Button>
  </div>
);

//asChild for link in button

export const SignoutBtn = () => {
  const { isPending, handleSignout } = useSignout();

  return (
    <SheetClose asChild>
      <Button
        size={"lg"}
        disabled={isPending}
        variant="destructive"
        onClick={handleSignout}>
        {isPending ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          "Sign Out"
        )}
      </Button>
    </SheetClose>
  );
};

export const UserAvatar = ({ user }: UserCompProps) => (
  <div className="px-4">
    <Card className="border-primary/50">
      <CardContent className="flex flex-col gap-3 items-center">
        <Image
          className="rounded-full border-2 border-primary object-cover"
          priority //loading it first
          width={128}
          height={128}
          alt={user.name || "profile picture"}
          src={user.picture || "/images/no-user-image.webp"}
        />

        <h2 className="text-xl font-semibold">{user.name || user.email}</h2>
      </CardContent>
    </Card>
  </div>
);
