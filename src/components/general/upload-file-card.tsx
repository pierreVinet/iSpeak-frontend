import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Clouds from "../illustrations/Clouds";
import Link from "next/link";

const UploadFileCard = () => {
  return (
    <Card className="w-full">
      <CardHeader className="py-2">
        <CardTitle>Upload File</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Clouds className="w-[250px] h-[250px]" />
        <CardDescription>
          Upload your video or audio recordings of your session here
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-row justify-center">
        <Button asChild>
          <Link href="/dashboard/sessions/upload">Upload Recording</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UploadFileCard;
