import { NextResponse } from 'next/server';
import { connect, serializeFirestoreData } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { STATUS_VALUES, SHORTLISTED_STATUSES } from '@/constants';
import { sendStatusEmail } from '@/lib/mailer';

export async function PATCH(req, { params }) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || session.user.role !== "admin") {
        return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connect();

    const { id } = params;
    const body = await req.json().catch(() => ({}));
    const { status, note, shortlisted: legacyShortlisted } = body;

    try {
        const docRef = db.collection('formData').doc(id);
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            return NextResponse.json({ success: false, message: 'Applicant not found' }, { status: 404 });
        }

        const prev = snapshot.data() || {};
        const update = { updatedAt: new Date() };
        let newStatus = prev.status || "applied";

        if (typeof status !== "undefined") {
            if (!STATUS_VALUES.includes(status)) {
                return NextResponse.json(
                  { success: false, message: `Invalid status. Use: ${STATUS_VALUES.join(", ")}` },
                  { status: 400 }
                );
            }
            newStatus = status;
            update.status = status;
        } else if (typeof legacyShortlisted !== "undefined") {
            // Backwards-compatible toggle: shortlist <=> interview, unshortlist <=> applied
            newStatus = legacyShortlisted ? "interview" : "applied";
            update.status = newStatus;
        }

        if (typeof note !== "undefined") {
            update.statusNote = String(note).slice(0, 1000);
        }

        // Keep the legacy boolean in sync so old filters keep working
        update.shortlisted = SHORTLISTED_STATUSES.includes(newStatus);

        await docRef.update(update);
        const updated = await docRef.get();

        const applicant = {
            id: updated.id,
            _id: updated.id,
            ...serializeFirestoreData(updated.data()),
        };

        // Best-effort status email (never fails the update)
        const statusChanged = prev.status !== newStatus || !prev.status;
        let emailSent = false;
        if (statusChanged && ["under_review", "interview", "accepted", "rejected"].includes(newStatus)) {
            emailSent = await sendStatusEmail({
                to: applicant.Email,
                name: applicant.Name,
                dept: applicant.Department,
                status: newStatus,
            });
        }

        return NextResponse.json({ success: true, data: applicant, emailSent });
    } catch (error) {
        console.error('Error updating applicant:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
