// app/api/clerk/webhook/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export const allowedMethods = ['POST'];

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

interface User {
  _id?: string;
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
}

export async function GET() {
  console.log('GET /api/webhooks/clerk was hit!'); // Added log
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function POST(req: Request) {
  console.log('Webhook endpoint hit!'); // Debug log

  try {
    const payload = await req.text();
    console.log('Received payload:', payload); // Debug log

    const headersList = await headers();
    const svix = new Webhook(WEBHOOK_SECRET);

    const svixHeaders = {
      "svix-id": headersList.get("svix-id") || "",
      "svix-timestamp": headersList.get("svix-timestamp") || "",
      "svix-signature": headersList.get("svix-signature") || "",
    };
    console.log('Webhook headers:', svixHeaders); // Debug log

    let event: any;

    try {
      event = svix.verify(payload, svixHeaders);
      console.log('Verified event:', event); // Debug log
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    }

    const { type, data } = event;
    console.log('Event type:', type); // Debug log
    console.log('Event data:', data); // Debug log

    let user: Partial<User> = {};

    switch (type) {
      case "user.created": {
        console.log('Processing user.created event'); // Debug log
        const {
          id,
          email_addresses,
          image_url,
          first_name,
          last_name,
          username,
        } = event.data;

        const userPayload = {
          clerkId: id,
          email: email_addresses[0].email_address,
          username: username!,
          firstName: first_name,
          lastName: last_name,
          photo: image_url,
        };
        console.log('Creating user with payload:', userPayload); // Debug log

        user = await createUser(userPayload);
        console.log('User created:', user); // Debug log
        break;
      }
      case "user.updated": {
        console.log('Processing user.updated event'); // Debug log
        const { id, image_url, first_name, last_name, username } = event.data;

        const userPayload = {
          firstName: first_name,
          lastName: last_name,
          username: username!,
          photo: image_url,
        };
        console.log('Updating user with payload:', userPayload); // Debug log

        user = await updateUser(id, userPayload);
        console.log('User updated:', user); // Debug log
        break;
      }
      case "user.deleted": {
        console.log('Processing user.deleted event'); // Debug log
        const { id } = event.data;

        user = await deleteUser(id!);
        console.log('User deleted:', user); // Debug log
        break;
      }
      default:
        console.log(`Unhandled event type: ${type}`);
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
