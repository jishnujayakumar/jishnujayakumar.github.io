---
layout: post
title: Save raw depth as JPEG or PNG?
date: 19 Dec 2024
description: A case study of saving raw depth from fetch robot camera as JPEG and PNG
jumbotron: 
jumbotron_alt: 
tags: case-study depth
categories: research robotics phd-life
---

<img src="../../../assets/blog/jpg-vs-png/jpg-vs-png-depth-jumbotron.gif" alt="Docker for academic research" width="100%" height="auto" >
<center>3D point cloud containing scenes created using <strong style="color:red">JPEG</strong> and <strong style="color:lightgreen">PNG</strong> Depth images.</center><br>
<hr>

## Index
- [Index](#index)
- [The Spark: A Quest for Compression](#the-spark-a-quest-for-compression)
- [The Twist: Shaky 3D Scenes](#the-twist-shaky-3d-scenes)
- [RGB + JPEG Depth Scene Point Cloud](#rgb--jpeg-depth-scene-point-cloud)
- [The Discovery: Switching to PNG](#the-discovery-switching-to-png)
- [The Evidence: Videos and Point Clouds](#the-evidence-videos-and-point-clouds)
- [Lessons Learned: Why PNG Wins](#lessons-learned-why-png-wins)
- [Closing Thoughts](#closing-thoughts)

---

## The Spark: A Quest for Compression

In my recent robotics project, data collection was progressing at full steam. The challenge? Managing the ever-growing volume of RGB and depth images. 📈 Compression seemed like the perfect solution. For RGB images, JPEG was a natural choice—efficient, widely used, and capable of reducing file sizes significantly. But then came the question: Could JPEG work for depth images too? 💾

Eager to streamline the process, I stored both RGB and depth images in JPEG format. It felt like a practical and straightforward decision at the time.

---

## The Twist: Shaky 3D Scenes

Things took an unexpected turn when I moved to the next phase: generating 3D scene point clouds from the depth data. Point clouds are critical for extracting insights and performing spatial analysis. 🧠 Using my JPEG-based dataset, I plotted the point clouds—and that’s when the problems began. The 3D scenes were noisy, unstable, and lacked the precision I needed. ❌

Digging deeper, I realized that JPEG’s 8-bit storage capacity was the issue. Depth data, which demands high precision, was being constrained by the format’s limitations. Crucial details were lost, resulting in inaccuracies in the visualized 3D scenes.

<img src="../../../assets/blog/jpg-vs-png/rgbd-jpeg-3d.gif" width="100%">
<center>RGB + JPEG Depth Scene Point Cloud</center>
---

## The Discovery: Switching to PNG

To address the issue, I switched to storing depth images in PNG format. Unlike JPEG, PNG supports 16-bit storage, which offers a much higher range for representing depth values. With this new setup, I recollected data and generated fresh point clouds. 🎨

The results were striking. The PNG-based depth data produced clear, accurate, and stable 3D scenes. The increased bit depth preserved the subtle variations in depth values, enabling precise visualization and analysis. 🌄

What seemed like a minor choice of file format turned out to have a major impact on the quality and usability of the data.


<img src="../../../assets/blog/jpg-vs-png/rgbd-png-3d.gif" width="100%">
<center>RGB + PNG Depth Scene Point Cloud</center>

---

## The Evidence: Videos and Point Clouds

To highlight the differences, I created visual comparisons:

<video class="demo-video" width="100%" height="auto" controls>
    <source src="../../../assets/blog/jpg-vs-png/output_jpg.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
<center>RGB + JPEG Depth</center>

<br>

<video class="demo-video" width="100%" height="auto" controls>
    <source src="../../../assets/blog/jpg-vs-png/output_png.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
<center>RGB + PNG Depth</center>

<br>

<video class="demo-video" width="100%" height="auto" controls>
    <source src="../../../assets/blog/jpg-vs-png/rgbd-jpg-png.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
<center>3D scene point clouds created using depth data from both JPEG and PNG are shown in a single 3D frame.</center>

<br>

It is evident that JPEG depth loses some depth information, while PNG is better at capturing a wider range of depth values. These visualizations clearly demonstrate why PNG is the superior choice for depth data.

---

## Lessons Learned: Why PNG Wins

The key factor is **bit depth**. JPEG’s 8-bit limitation truncates depth information, leading to significant data loss. PNG’s 16-bit capacity retains the full range of depth values, preserving the integrity of the data.

While JPEG remains excellent for RGB images, the precision needs of depth data make PNG the better option. The slightly larger file size is a small trade-off for the significant gains in accuracy and reliability. 📁


Here’s what I did to subscribe to depth data from the ROS topic on the Fetch robot.
```python
if depth.encoding == "32FC1":
    # Convert depth message to OpenCV format
    depth_cv = self.cv_bridge.imgmsg_to_cv2(depth)

    # Replace NaN values with 0 and convert from meters to millimeters
    depth_cv = np.array(depth_cv)
    depth_cv[np.isnan(depth_cv)] = 0
    depth_cv = depth_cv * 1000

    # Convert to uint16 for consistency
    depth_cv = depth_cv.astype(np.uint16)

    # TODO: Save as png
```

---

## Closing Thoughts

In robotics, even seemingly minor decisions—like choosing a file format—can have far-reaching implications.

Next time you’re deciding between JPEG and PNG for depth images, remember: precision matters. Choose wisely to let your data shine—clearly and accurately. ✅

If you’ve worked with other formats for depth data, I’d love to hear your insights. 🤝✨

---

Feel free to reach out in case you have a query. You are always welcome. You can find me on X at [@jis_padalunkal](https://x.com/jis_padalunkal){:target="_blank"}.

<script>
  document.getElementByClass('demo-video').playbackRate = 1.5;
</script>