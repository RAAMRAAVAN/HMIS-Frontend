# WhatsApp Call QA Checklist

## Scope
Manual verification checklist for call stability in the WhatsApp module, focused on hold, media switching, and call-state correctness.

## Pre-checks
- Open two separate user sessions (different browsers/devices preferred).
- Confirm both users are online and can message each other.
- Confirm mic/camera permissions are granted on both ends.

## Test Matrix

### 1) Voice call baseline
1. User A starts voice call to User B.
2. User B accepts.
3. Verify both hear each other.
4. Verify top status shows active call (not stuck on connecting).

Expected:
- Audio is bidirectional.
- Connection label becomes Connected.
- Call duration starts increasing.

### 2) Hold from caller
1. During active voice call, User A taps Hold.
2. Wait 3–5 seconds.
3. User A and User B both attempt speaking.

Expected:
- No one hears the other while hold is active.
- User A sees "You are on hold".
- User B sees "Peer is on hold".

### 3) Resume from caller
1. User A taps Resume.
2. Both users speak again.

Expected:
- Two-way audio resumes.
- Hold indicators clear.

### 4) Hold from receiver
1. During active voice call, User B taps Hold.
2. Wait 3–5 seconds.
3. Both users attempt speaking.

Expected:
- No one hears the other while hold is active.
- Indicators are mirrored correctly.

### 5) Voice -> Video switch
1. During active voice call, User A switches to video.
2. Verify renegotiation message appears briefly.
3. Verify call returns to active state.

Expected:
- No persistent "Connecting call..." after media is stable.
- Controls are temporarily disabled during renegotiation and re-enabled after.
- Audio remains stable.

### 6) Video -> Voice switch
1. During active video call, User A switches back to voice.
2. Verify remote video area clears.

Expected:
- Video tracks stop cleanly.
- Audio remains stable.
- Call stays active.

### 7) Hold while in video call
1. In active video call, User A taps Hold.
2. Check both audio and video behavior.

Expected:
- Audio and local outbound media are paused effectively.
- Resume restores media according to mic/camera toggles.

### 8) Rapid action safety
1. During call, repeatedly attempt quick taps on hold/switch buttons during transition.

Expected:
- No crash, no duplicated state, no stuck UI.
- Controls block interactions while renegotiating.

### 9) End-call sanity
1. End call from either side.

Expected:
- Overlay closes on both sides.
- Media devices release.
- No residual ringtone/hold/connecting state.

## Regression Notes
- Re-test missed call flow after these scenarios.
- Re-test call logs rendering in chat after completed/missed calls.
