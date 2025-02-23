"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ReportCategory } from "@/db/schema";

interface ReportUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reportedUser: {
        id: string;
        name: string;
    };
}

export function ReportUserDialog(
    { open, onOpenChange, reportedUser }: ReportUserDialogProps,
) {
    const [category, setCategory] = useState<ReportCategory | "">("");
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!category || !reason.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reportedUserId: reportedUser.id,
                    category,
                    reason,
                    details,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit report");
            }

            toast.success("Report submitted successfully");
            onOpenChange(false);
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit report");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setCategory("");
        setReason("");
        setDetails("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="text-destructive h-5 w-5" />
                        Report User
                    </DialogTitle>
                    <DialogDescription>
                        Report inappropriate behavior by{" "}
                        {reportedUser.name}. Our moderators will review your
                        report.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label
                            htmlFor="category"
                            className="text-sm font-medium"
                        >
                            Category
                        </label>
                        <Select
                            value={category}
                            onValueChange={(value) =>
                                setCategory(value as ReportCategory)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(REPORT_CATEGORY_LABELS).map((
                                    [value, label],
                                ) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="reason" className="text-sm font-medium">
                            Reason
                        </label>
                        <Input
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Brief description of the issue"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label
                            htmlFor="details"
                            className="text-sm font-medium"
                        >
                            Additional Details
                        </label>
                        <Textarea
                            id="details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Provide any additional context or details about the incident"
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
