# How to Configure obs:// Protocol

The `obs://` protocol needs to be registered on your operating system to allow web browsers to open OBS Studio.

## For macOS (Your System)

### Option 1: Automated Setup (Recommended)

1. Run the setup script:
   ```bash
   cd /Users/toufiqulislam/projects/personal/ometest/frontend
   chmod +x setup-obs-protocol-mac.sh
   ./setup-obs-protocol-mac.sh
   ```

2. The first time you click the "Open OBS Studio" button:
   - macOS will ask "Do you want to allow this page to open OBS Protocol Handler?"
   - Click "Allow"
   - Check "Remember my choice"

3. Done! The button will now open OBS Studio.

### Option 2: Manual Setup

1. **Create an AppleScript Application:**

   Open **Script Editor** (Applications → Utilities → Script Editor)

   Paste this code:
   ```applescript
   on open location this_URL
       do shell script "open -a '/Applications/OBS.app'"
   end open location
   ```

   Save as:
   - **File Format:** Application
   - **Name:** OBS Protocol Handler
   - **Location:** `~/Library/Scripts/`

2. **Test the Protocol:**

   - Open Safari or Chrome
   - Type `obs://` in the address bar
   - Press Enter
   - Select "OBS Protocol Handler" when prompted
   - Check "Always open these types of links"

3. **Done!** Now the button will work.

---

## For Windows

### Create a Registry Entry

1. Press `Win + R`, type `regedit`, press Enter

2. Navigate to: `HKEY_CLASSES_ROOT`

3. Right-click → New → Key, name it `obs`

4. In the `obs` key:
   - Double-click "(Default)"
   - Set value to: `URL:OBS Protocol`
   - Click OK

5. Right-click the `obs` key → New → String Value
   - Name: `URL Protocol`
   - Leave value empty

6. Create this structure under `obs`:
   ```
   obs
   └── shell
       └── open
           └── command
   ```

7. In the `command` key:
   - Double-click "(Default)"
   - Set value to: `"C:\Program Files\obs-studio\bin\64bit\obs64.exe"`
   - (Adjust path if OBS is installed elsewhere)

8. Done! Restart your browser and the button will work.

---

## For Linux

### Create a Desktop Entry

1. Create a desktop file:
   ```bash
   sudo nano /usr/share/applications/obs-protocol.desktop
   ```

2. Add this content:
   ```ini
   [Desktop Entry]
   Type=Application
   Name=OBS Protocol Handler
   Exec=/usr/bin/obs %u
   Terminal=false
   MimeType=x-scheme-handler/obs
   ```

3. Update desktop database:
   ```bash
   sudo update-desktop-database
   ```

4. Set as default handler:
   ```bash
   xdg-mime default obs-protocol.desktop x-scheme-handler/obs
   ```

5. Done! The button will now work.

---

## Quick Test

After setup, test by opening this URL in your browser:
```
obs://
```

If OBS Studio opens, the setup was successful! ✅

---

## Note

If you don't want to configure the protocol, you can simply:
- Remove the button, or
- Keep it as a reminder to manually open OBS Studio

