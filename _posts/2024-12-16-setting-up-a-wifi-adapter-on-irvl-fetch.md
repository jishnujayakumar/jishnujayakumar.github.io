---
layout: post
title: Setting Up a Wi-Fi Hotspot on Boot for Your Robot
date: 16 Dec 2024
description: Robots operating in environments without reliable network connectivity often require a self-hosted Wi-Fi hotspot for seamless operation. This blog post will guide you through creating a Wi-Fi hotspot on boot using a Linux-based system, ensuring uninterrupted communication with your robot.
tags: robot wifi hotspot network system setup
categories: research robotics phd-life sys_setup
---

<img src="{{ site.baseurl }}/assets/blog/irvl-fetch-wifi-adapter-diy/alpha_adapter/robot-human-hololens.png" alt="robot-human-hololens" width="100%">
<center>At the <a href="https://labs.utdallas.edu/irvl/" target="_blank">Intelligent Robotics and Vision Lab</a>, I am trying to establish a connection between the <span style="font-weight: bold">HoloLens 2</span> device mounted on my head and the <span style="font-weight: bold">Fetch</span> robot.</center><br>

<hr>

## Index
- [Index](#index)
  - [Why Create a Wi-Fi Hotspot on Boot?](#why-create-a-wi-fi-hotspot-on-boot)
  - [Prerequisites](#prerequisites)
  - [Step 1: Create the Hotspot Script](#step-1-create-the-hotspot-script)
  - [Step 2: Create a Credentials File](#step-2-create-a-credentials-file)
  - [Step 3: Create a Systemd Service](#step-3-create-a-systemd-service)
  - [Step 4: Verify Hotspot on Boot](#step-4-verify-hotspot-on-boot)
  - [Step 5: Optional – Add Status Check to ~/.bashrc](#step-5-optional--add-status-check-to-bashrc)
  - [Troubleshooting](#troubleshooting)

---

### Why Create a Wi-Fi Hotspot on Boot?  
In robotics, self-hosted networks can be critical for:  
- Connecting remote controllers or operator devices.  
- Transmitting real-time data streams (e.g., images, depth, or control commands).  
- Enabling peer-to-peer communication in isolated environments.  

Let’s configure a Wi-Fi hotspot to start automatically whenever your robot boots up. 📡🤖✨

---

### Prerequisites  
- A Linux-based system (tested on Ubuntu). Our Fetch robot has Ubuntu 18.04 installed.
- NetworkManager installed (commonly pre-installed on Ubuntu).  
- A compatible Wi-Fi adapter connected to the robot.  
- Root access to the system.

📋 Ensure these are set up before proceeding!

<video class="demo-video" width="100%" height="50%" controls>
  <source src="../../../assets/blog/irvl-fetch-wifi-adapter-diy/alpha_adapter/robot-with-alpha-adapter.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>


<center><a href="https://www.amazon.com/Network-AWUS036ACM-Long-Range-Wide-Coverage-High-Sensitivity/dp/B08BJS8FXD/ref=asc_df_B08BJS8FXD?mcid=bda890b6f4353c769755c6838472b8c9&tag=hyprod-20&linkCode=df0&hvadid=693415510935&hvpos=&hvnetw=g&hvrand=11530231208179162355&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9026839&hvtargid=pla-996386731604&psc=1" target="_blank">Alpha Dual Antenna Wifi Adapter</a> connected on top of the head of our Fetch robot.</center><br>


---

### Step 1: Create the Hotspot Script  
Let's have a directory related to this setting:
```shell
# try setting absolute path
export WIFI_ADAP_ROOT_DIR=/home/fetch/wifi-adapter-settings
mkdir -p $WIFI_ADAP_ROOT_DIR
cd $WIFI_ADAP_ROOT_DIR
```

We’ll use a Bash script to configure and start the hotspot. Create the file `start_hotspot.sh`:
```shell
#!/bin/bash

# Disable the firewall
ufw disable

echo "Firewall stopped and disabled on system startup"

# Wait for 2 seconds
sleep 2

# Read credentials and create hotspot
CREDS_FILE=$WIFI_ADAP_ROOT_DIR/hotspot_creds.cfg
source $CREDS_FILE

# Create the hotspot
nmcli device wifi hotspot ifname alpha_wifi_adap ssid "$SSID" password "$PASSWORD" band a channel 149
```

Explanation of the Script:  
- **Disable the firewall:** Ensures no network traffic is blocked (adjust this for secure setups).  
- **Wait for 2 seconds:** Adds a buffer to ensure system services are up.  
- **Source credentials:** Reads the hotspot name (SSID) and password from hotspot_creds.cfg.  
- **Set up the hotspot:** Uses nmcli to configure and start the hotspot.  

Save this script to `$WIFI_ADAP_ROOT_DIR/start_hotspot.sh` and make it executable:  
```shell
chmod +x $WIFI_ADAP_ROOT_DIR/start_hotspot.sh
```

---

### Step 2: Create a Credentials File  
Store your hotspot credentials in a secure configuration file:  
```shell
nano $WIFI_ADAP_ROOT_DIR/hotspot_creds.cfg
```

Add the following content:  
```shell
SSID="your_hotspot_name"
PASSWORD="your_secure_password"
```

Make sure the credentials file is readable only by the owner:  
```shell
chmod 600 $WIFI_ADAP_ROOT_DIR/hotspot_creds.cfg
```
🛡️ This keeps your credentials secure!

---

### Step 3: Create a Systemd Service  
To ensure the hotspot script runs on every boot, create a systemd service file:  
```shell
sudo nano /etc/systemd/system/start_hotspot.service
```

Add the following content:  
```shell
[Unit]
Description=Start Hotspot Script on Boot
After=network.target

[Service]
Type=oneshot
ExecStart=/bin/bash /home/fetch/wifi-adapter-settings/start_hotspot.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

Explanation of the Service File:  
- **After=network.target:** Ensures the service starts after network services are ready.  
- **ExecStart:** Runs the hotspot script. *NOTE:* Keep the absolute path of the script.  
- **RemainAfterExit:** Keeps the service active after execution.  

Enable the service:  
```shell
sudo systemctl enable start_hotspot.service
```

Test the service by starting it manually:  
```shell
sudo systemctl start start_hotspot.service
sudo systemctl status start_hotspot.service
```

If successful, the hotspot should start without errors. 🚀✨

---

### Step 4: Verify Hotspot on Boot  
To confirm the hotspot starts correctly after reboot:  
- Reboot your system:  
  ```shell
  sudo reboot
  ```  
- Once the system boots up, check the hotspot status:  
  ```shell
  sudo systemctl status start_hotspot.service
  ```  
- You can also use the nmcli command to verify:  
  ```shell
  nmcli dev wifi
  ```

✅ This ensures everything is working smoothly! 🌟

---

### Step 5: Optional – Add Status Check to ~/.bashrc  
For convenience, add a status check to your `~/.bashrc` file. This will display the hotspot’s status whenever you open a terminal:  
```shell
# Check Hotspot Status, use absolute path
CREDS_FILE=/home/fetch/wifi-adapter-settings/hotspot_creds.cfg
if [ -f $CREDS_FILE ]; then
    source $CREDS_FILE
    if nmcli dev wifi | grep -q "$SSID"; then
        ip_address=$(ip addr show alpha_wifi_adap | grep 'inet ' | awk '{print $2}' | cut -d/ -f1)
        echo "Hotspot '$SSID' is LIVE."
        echo -e "- IP: $ip_address
- Password: $PASSWORD"
    else
        echo "Hotspot '$SSID' is NOT ACTIVE."
    fi
else
    echo "Hotspot credentials file not found."
fi
```
<center>
  <div style="display: flex; align-items: center;">
    <!-- Image Section: 30% Width -->
    <img src="{{ site.baseurl }}/assets/blog/irvl-fetch-wifi-adapter-diy/alpha_adapter/step-5-out.png" alt="Step 5 Output" style="width: 45%; margin-right: 20px;">

    <!-- Video Section: 65% Width -->
    <video class="demo-video" width="58%" height="auto" controls>
      <source src="../../../assets/blog/irvl-fetch-wifi-adapter-diy/alpha_adapter/connect-hololens2-to-robot-hotspot.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</center>

<center><b>Left:</b> Hotspot status after system boot.<br><b>Right:</b> A demo showcasing the HoloLens connecting to the created hotspot.</center><br>

---

### Troubleshooting  
- **Error: Not authorized to control network:**  
  - Ensure the script is executed with root privileges.  
- **Error: either 'dev' is duplicate or 'iwlist' is garbage:**  
  - Verify the hotspot interface name (alpha_wifi_adap).  
  - Double-check the hotspot script syntax.  
- **Hotspot not starting on boot:**  
  - Check the service logs:  
    ```shell
    sudo journalctl -u start_hotspot.service
    ```

🛠️ Be ready to debug as needed! 🧩  

---

Feel free to reach out in case you have a query. You are always welcome. You can find me on X at [@jis_padalunkal](https://x.com/jis_padalunkal){:target="_blank"}.

<script>
  document.getElementByClass('demo-video').playbackRate = 1.5;
</script>