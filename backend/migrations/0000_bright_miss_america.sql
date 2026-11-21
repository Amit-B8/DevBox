CREATE TYPE "public"."feedback_category" AS ENUM('bug_report', 'feature_request', 'suggestion', 'general_feedback');--> statement-breakpoint
CREATE TYPE "public"."usage_action" AS ENUM('tool_view', 'calculate', 'convert', 'generate', 'copy_result');--> statement-breakpoint
CREATE TABLE "tool_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tool_id" varchar(100) NOT NULL,
	"action" "usage_action" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tool_id" varchar(100),
	"category" "feedback_category" NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feedback_message_length" CHECK (char_length(trim("user_feedback"."message")) between 10 and 2000)
);
--> statement-breakpoint
CREATE INDEX "usage_created_tool_idx" ON "tool_usage" USING btree ("created_at","tool_id");--> statement-breakpoint
CREATE INDEX "feedback_created_idx" ON "user_feedback" USING btree ("created_at");