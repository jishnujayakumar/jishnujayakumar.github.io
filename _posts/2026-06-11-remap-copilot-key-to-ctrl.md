---
layout: post
title: Remapping the Copilot key to Ctrl on Ubuntu 22.04
date: 11 Jun 2026
description: The Copilot key is not a real key — it is a three-key macro baked into firmware. Here is how to turn it into a proper Ctrl key on Linux using keyd.
og_image: /assets/blog/copilot-key-remap/outside-the-lab.jpg
thumbnail: /assets/blog/copilot-key-remap/thumbnail.jpg
jumbotron:
jumbotron_alt:
tags: linux keyboard tooling how-to
categories: linux phd-life
---

<img src="../../../assets/blog/copilot-key-remap/outside-the-lab.jpg" alt="Lenovo Legion laptop on a table by the window, outside the lab" width="100%" height="auto" >
<center>Sitting outside the lab, fixing my keyboard key issue. ☀️</center><br>
<hr>

> **A note before we start:** This post was created with the help of an LLM, so please do a fact check before applying anything. I had attempted this remap several times on my own without success — an LLM-assisted debugging session is what finally worked for me, so I documented the recipe here. Also, this trade is personal: right Ctrl is important to *my* workflow, which is why I remapped it. If the Copilot key is more useful for your use case, please keep it as it is.

## Index
- [Index](#index)
- [The Problem: A Key I Never Press](#the-problem-a-key-i-never-press)
- [Trivia: Why Does This Key Exist At All?](#trivia-why-does-this-key-exist-at-all)
- [The Twist: It Is Not Actually a Key](#the-twist-it-is-not-actually-a-key)
- [Why the Usual Tools Fail](#why-the-usual-tools-fail)
- [The Fix: keyd](#the-fix-keyd)
- [The Gotcha That Cost Me Ten Minutes](#the-gotcha-that-cost-me-ten-minutes)
- [Verifying It Works](#verifying-it-works)
- [Notes and Edge Cases](#notes-and-edge-cases)
- [Closing Thoughts](#closing-thoughts)

---

## The Problem: A Key I Never Press

My Lenovo Legion 5 (15IRX10) has no right Ctrl key. In its place sits the **Copilot key** — the one with the swirly logo next to right Alt. I press Ctrl hundreds of times a day and Copilot exactly zero times, so the trade was obvious: turn the Copilot key into Ctrl. 🎯

<img src="../../../assets/blog/copilot-key-remap/copilot-keyboard.jpg" alt="Lenovo Legion keyboard with the Copilot key next to the right Alt" width="100%" height="auto" >
<center>The mystery key next to right <strong>Alt</strong> — the Copilot key. Prime real estate going to waste.</center><br>

How hard could a single key remap be? As it turns out, harder than expected — because of what this key actually is.

---

## Trivia: Why Does This Key Exist At All?

The Copilot key is a Microsoft creation, not a laptop-maker's idea. [Announced on January 4, 2024](https://blogs.windows.com/windowsexperience/2024/01/04/introducing-a-new-copilot-key-to-kick-off-the-year-of-ai-powered-windows-pcs/), Microsoft called it the *"first significant change to the Windows PC keyboard in nearly three decades"* — the last one being the Windows key itself, introduced in 1994. Pressing it launches Microsoft Copilot, their AI assistant, on Windows 11.

It became part of the broader AI-PC wave: [the key was included in Microsoft's "AI PC" definition](https://winaero.com/intel-the-copilot-key-is-a-mandatory-requirement-for-ai-powered-pcs/), and 2024-onward laptops from Lenovo, Dell, HP, and others adopted it — on compact layouts it typically takes the spot where right Ctrl or the menu key used to live, which is exactly how I met it.

The `Win+Shift+F23` chord we saw above is a neat piece of engineering history: rather than defining a brand-new keycode (which would have meant touching the USB HID standard and keyboard drivers everywhere), Microsoft [hardwired the key to emit a chord](https://learn.microsoft.com/en-us/answers/questions/2286867/how-do-i-force-the-copilot-key-to-become-a-differe) built from keycodes that had sat unused in the HID spec for decades — F23 finally found a job. A clever shortcut for instant compatibility with every OS and driver stack; also the reason remapping it takes chord-matching tricks rather than a one-line keycode swap.

Windows 11 later [added a built-in way to customize the key](https://pureinfotech.com/customize-copilot-key-action-windows-11/) (Settings → Personalization → Text input) to launch the app of your choice. On Linux the key simply does nothing out of the box — so remapping it is pure upside: you are not giving anything up. 📈

---

## The Twist: It Is Not Actually a Key

Run keyd's event monitor and press the Copilot key once:

```bash
sudo keyd -m
```

```
ITE Tech. Inc. ITE Device(8258) Keyboard    048d:c195:da10980f    leftmeta down
ITE Tech. Inc. ITE Device(8258) Keyboard    048d:c195:da10980f    leftshift down
ITE Tech. Inc. ITE Device(8258) Keyboard    048d:c195:da10980f    f23 down
ITE Tech. Inc. ITE Device(8258) Keyboard    048d:c195:da10980f    f23 up
ITE Tech. Inc. ITE Device(8258) Keyboard    048d:c195:da10980f    leftshift up
ITE Tech. Inc. ITE Device(8258) Keyboard    048d:c195:da10980f    leftmeta up
```

One physical key, **three** key events. The firmware emits the chord `LeftMeta + LeftShift + F23` — the shortcut that launches Copilot on Windows. There is no "Copilot keycode". The OS never sees a single key; it sees a macro. 🤯

> 💡 The exact chord varies by laptop. Some machines emit only `leftshift+leftmeta` without the `f23`. Always check with `sudo keyd -m` before writing any config.

---

## Why the Usual Tools Fail

This firmware-level macro is exactly why the classic remapping approaches fall flat:

- **xmodmap / GNOME Tweaks**: remap single keysyms. There is no single keysym here — and xmodmap is an X11 utility, so it does nothing for Wayland sessions.
- **udev hwdb**: can remap the `f23` scancode to `rightctrl`, but the firmware still sends Meta and Shift alongside it. You end up pressing `Meta+Shift+Ctrl` — useless for shortcuts.

What we need is something that can match the *chord* and replace the whole thing. That is precisely what [keyd](https://github.com/rvaiya/keyd) does: a kernel-level remapping daemon that grabs input devices, rewrites events, and re-emits them through a virtual keyboard. It works in Wayland, X11, and even the virtual console.

---

## The Fix: keyd

Ubuntu 22.04 does not ship keyd ([it only entered the Ubuntu archive in 25.10](https://launchpad.net/ubuntu/+source/keyd)), but building from source takes under a minute and needs nothing beyond a C compiler and the kernel headers already present on most systems:

```bash
sudo apt install git build-essential
git clone https://github.com/rvaiya/keyd
cd keyd
make && sudo make install
sudo systemctl enable --now keyd
```

Then create `/etc/keyd/default.conf`:

```ini
[ids]
*

[main]
leftshift+leftmeta+f23 = layer(control)
```

The left-hand side is a keyd **chord**: it fires only when all three keys arrive together (within keyd's chord window), which is exactly how the firmware sends them. The right-hand side activates the control layer, so holding the Copilot key now behaves like holding Ctrl.

Apply it:

```bash
sudo keyd reload
```

Done. Copilot+C copies, Copilot+T opens a new browser tab, Copilot+L focuses the address bar. The dead key lives. ⚡

---

## The Gotcha That Cost Me Ten Minutes

After installing keyd I ran `sudo keyd reload` and... nothing changed. `keyd -m` kept showing the raw `leftmeta/leftshift/f23` events with no remapping in sight.

The reason was hiding in the journal:

```bash
journalctl -u keyd --no-pager | tail
```

```
keyd[19693]: DEVICE: ignoring 048d:c195:da10980f  (ITE Tech. Inc. ITE Device(8258) Keyboard)
```

`make install` installs the daemon and the systemd unit, **but it does not create a config file**. With no `/etc/keyd/default.conf`, keyd has no `[ids]` section to match against, so it politely ignores every keyboard on the system. The service runs, reload succeeds, and nothing happens — a perfectly silent failure. 🤦

Two diagnostics worth remembering:

1. **`keyd -m` shows both sides of the pipeline.** Raw hardware events appear under your physical keyboard's name; remapped output appears under `keyd virtual keyboard`. If you only see the former, keyd is not grabbing your device.
2. **The journal names every device decision.** `DEVICE: ignoring ...` vs. `DEVICE: match ...` tells you instantly whether your config applies to your keyboard.

---

## Verifying It Works

After writing the config and reloading, the journal flipped from `ignoring` to `match`:

```
keyd[19693]: DEVICE: match    048d:c195:da10980f  /etc/keyd/default.conf  (ITE Tech. Inc. ITE Device(8258) Keyboard)
keyd[19693]: DEVICE: match    0001:0001:70533846  /etc/keyd/default.conf  (AT Translated Set 2 keyboard)
```

And holding Copilot+C over selected text copied it. ✅

---

## Notes and Edge Cases

- **It maps to *left* Ctrl behavior.** keyd's control layer emits left Ctrl, not right Ctrl. For virtually everything — shortcuts, terminals, IDEs — the two are interchangeable. If some software of yours genuinely distinguishes right Ctrl, look at [remap-copilot](https://github.com/m-bartlett/remap-copilot), a small libevdev daemon built for exactly that.
- **Keep the `f23` in the chord.** A two-key `leftshift+leftmeta` chord also works on machines that emit no `f23`, but on machines that do, the three-key form avoids accidentally hijacking real Shift+Super shortcuts (e.g., GNOME's Shift+Super+arrow for moving windows between monitors) when you press them near-simultaneously.
- **If holding does not register on your machine**, your firmware may fire the full press+release sequence on key-down. The workaround is `oneshot(control)` instead of `layer(control)`: tap Copilot, then tap C, and Ctrl+C is emitted.

---

## Closing Thoughts

The Copilot key turned out to be a delightful little case study in how modern keyboards actually work: what looks like a key can be a macro, and remapping it means reaching for tooling that operates below the display server. keyd handles it in four lines of config — once you know the config file does not create itself. 😄

If your keyboard has a key you never press sitting where one you press constantly used to be, now you know how to make it yours.

---

## References
- [Microsoft: Introducing a new Copilot key (Windows Experience Blog, Jan 4, 2024)](https://blogs.windows.com/windowsexperience/2024/01/04/introducing-a-new-copilot-key-to-kick-off-the-year-of-ai-powered-windows-pcs/)
- [Intel: the Copilot key is a requirement under the "AI PC" program definition](https://winaero.com/intel-the-copilot-key-is-a-mandatory-requirement-for-ai-powered-pcs/)
- [Pureinfotech: How to customize the Copilot key action on Windows 11](https://pureinfotech.com/customize-copilot-key-action-windows-11/)
- [keyd — A key remapping daemon for Linux](https://github.com/rvaiya/keyd)
- [remap-copilot — libevdev daemon for the Copilot key](https://github.com/m-bartlett/remap-copilot)
- [Manjaro forum: How to remap the Copilot key to right control](https://forum.manjaro.org/t/how-to-remap-the-copilot-key-to-right-control/172909)
