"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { mailingTemplate } from "@/constants";

import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Blockquote from "@tiptap/extension-blockquote";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useState } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CiWarning } from "react-icons/ci";
import { Input } from "./ui/input";

export default function MailComposer({ recipients, handleRowSelection }) {
    const [payloadData, setPayloadData] = useState({
        subject: "",
        body: "",
        mailType: "",
    });

    const [confirm, setConfirm] = useState(false);

    const templateTypes = ["Blank", "Interview Invite"];

    const editor = useEditor({
        extensions: [
            StarterKit,
            Document,
            Paragraph,
            Text,
            Heading.configure({
                levels: [1], // All heading levels
                HTMLAttributes: {
                    class: `text-4xl font-bold`,
                },
            }),
            Blockquote.configure({
                HTMLAttributes: {
                    class: "border-l-2 border-gray-800 pl-4 opacity-[80%]",
                },
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: "list-disc ml-5",
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: "list-decimal ml-5",
                },
            }),
        ],
        content: "",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            setPayloadData((prev) => ({ ...prev, body: editor.getHTML() }));
        },
        editorProps: {
            attributes: {
                class: "min-h-[150px] cursor-text rounded-md border p-5 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ",
            },
        },
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Custom Mail</Button>
            </DialogTrigger>
            <DialogContent
                className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[75vw] overflow-x-hidden"
            >
                <DialogHeader>
                    <DialogTitle>Send Custom Mail</DialogTitle>
                    <DialogDescription>
                        Send customized mails to {recipients?.length ?? 0} selected
                        recipients.
                    </DialogDescription>
                </DialogHeader>
                {recipients !== 0 ? (
                    <div className="flex flex-col gap-3 justify-between">
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3 items-center justify-evenly">
                                {/* Subject */}
                                <Input
                                    className="max-w-[73vw]"
                                    placeholder="Subject"
                                    onChange={(e) =>
                                        setPayloadData({
                                            ...payloadData,
                                            subject: e.target.value,
                                        })
                                    }
                                />
                                {/* Select Template */}
                                <Select
                                    onValueChange={(value) => {
                                        switch (value) {
                                            case "Blank":
                                                editor.commands.setContent("");
                                                break;
                                            case "Interview Invite":
                                                setPayloadData({
                                                    ...payloadData,
                                                    mailType: value,
                                                });
                                                editor.commands.setContent(
                                                    mailingTemplate.Interview
                                                );
                                                break;
                                            default:
                                                editor.commands.setContent("");
                                        }
                                    }}
                                >
                                    <SelectTrigger className="max-w-[73vw]">
                                        <SelectValue placeholder="Templates" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templateTypes.map((tmp_type) => (
                                            <SelectItem key={tmp_type} value={tmp_type}>
                                                {tmp_type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-1 pb-3 max-w-[71vw] overflow-x-scroll">
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleBold()
                                            .run()
                                    }
                                    disabled={
                                        !editor
                                            .can()
                                            .chain()
                                            .focus()
                                            .toggleBold()
                                            .run()
                                    }
                                    className={
                                        editor.isActive("bold")
                                            ? "is-active"
                                            : ""
                                    }
                                >
                                    Bold
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleItalic()
                                            .run()
                                    }
                                    disabled={
                                        !editor
                                            .can()
                                            .chain()
                                            .focus()
                                            .toggleItalic()
                                            .run()
                                    }
                                    className={
                                        editor.isActive("italic")
                                            ? "is-active"
                                            : ""
                                    }
                                >
                                    Italic
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleStrike()
                                            .run()
                                    }
                                    disabled={
                                        !editor
                                            .can()
                                            .chain()
                                            .focus()
                                            .toggleStrike()
                                            .run()
                                    }
                                    className={
                                        editor.isActive("strike")
                                            ? "is-active"
                                            : ""
                                    }
                                >
                                    Strike
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleCode()
                                            .run()
                                    }
                                    disabled={
                                        !editor
                                            .can()
                                            .chain()
                                            .focus()
                                            .toggleCode()
                                            .run()
                                    }
                                    className={
                                        editor.isActive("code")
                                            ? "is-active"
                                            : ""
                                    }
                                >
                                    Code
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .unsetAllMarks()
                                            .run()
                                    }
                                >
                                    Clear marks
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .clearNodes()
                                            .run()
                                    }
                                >
                                    Clear nodes
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setParagraph()
                                            .run()
                                    }
                                    className={
                                        editor.isActive("paragraph")
                                            ? "is-active"
                                            : ""
                                    }
                                >
                                    Paragraph
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleHeading({ level: 1 })
                                            .run()
                                    }
                                    className={
                                        editor.isActive("heading", { level: 1 })
                                            ? "is-active"
                                            : ""
                                    }
                                >
                                    Heading
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleBulletList()
                                            .run()
                                    }
                                    className={
                                        editor.isActive("bulletList")
                                            ? "is-active"
                                            : ""
                                    }
                                >
                                    Bullet list
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleOrderedList()
                                            .run()
                                    }
                                    className={
                                        editor.isActive("orderedList")
                                            ? "is-active"
                                            : ""
                                    }
                                >
                                    Ordered list
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleCodeBlock()
                                            .run()
                                    }
                                    className={
                                        editor.isActive("codeBlock")
                                            ? "is-active"
                                            : ""
                                    }
                                >
                                    Code block
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleBlockquote()
                                            .run()
                                    }
                                    className={
                                        editor.isActive("blockquote")
                                            ? "is-active"
                                            : ""
                                    }
                                >
                                    Blockquote
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setHorizontalRule()
                                            .run()
                                    }
                                >
                                    Horizontal rule
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setHardBreak()
                                            .run()
                                    }
                                >
                                    Hard break
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor.chain().focus().undo().run()
                                    }
                                    disabled={
                                        !editor
                                            .can()
                                            .chain()
                                            .focus()
                                            .undo()
                                            .run()
                                    }
                                >
                                    Undo
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        editor.chain().focus().redo().run()
                                    }
                                    disabled={
                                        !editor
                                            .can()
                                            .chain()
                                            .focus()
                                            .redo()
                                            .run()
                                    }
                                >
                                    Redo
                                </Button>
                            </div>
                            <EditorContent editor={editor} />
                        </div>
                        <DialogFooter className="flex gap-3">
                            {!confirm ? (
                                <div className="flex gap-1 items-center justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setConfirm(true)}
                                    >
                                        Verify Mail
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-1 items-center justify-center">
                                    <Button
                                        variant="outline"
                                        className="opacity-[40%] cursor-not-allowed text-gray-600 hover:opacity-[40%]"
                                    >
                                        Verified
                                    </Button>
                                </div>
                            )}
                            <Button
                                type="submit"
                                onClick={() => {
                                    if (confirm) {
                                        handleRowSelection(payloadData);
                                        setConfirm(false);
                                    }
                                }}
                                className={
                                    !confirm &&
                                    "opacity-[40%] cursor-not-allowed text-gray-600 hover:opacity-[40%]"
                                }
                            >
                                Send Mail
                            </Button>
                        </DialogFooter>
                    </div>
                ) : (
                    <p>
                        <p className="flex gap-3 items-center justify-start font-light text-md text-red-500">
                            <CiWarning /> No recipients selected
                        </p>
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}
