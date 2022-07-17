---
layout: post
title: Using Docker for Academic Research
date: Wed 06 Jul 2022 06:54:24 PM CDT
description: Need for Docker in academic research
jumbotron: ../../../assets/blog/docker-for-research.svg
jumbotron_alt: Docker for academic research
tags: Docker research
categories: research
---
<img src="../../../assets/blog/docker-for-research.svg" alt="Docker for academic research" width="100%" height="150px" >
<center>Image made using logos available <a href='https://www.docker.com/company/newsroom/media-resources/' target="_blank">here</a>.</center><br>
<hr>
**Note**: *Reading this post needs familiarity with [Docker](https://www.docker.com/){:target="_blank"}. If you are new to the Docker world, I suggest looking [here](https://www.youtube.com/watch?v=iqqDU2crIEQ){:target="_blank"}. This post is more catered towards the steps required for creating and pushing images to [DockerHub]. Hence kess *


<!-- <hr> -->

Docker is a well-known tool. Although it is used prominently in the industry, there is a usage gap when talking about academic research. The main advantage of using Docker is that it allows the creation of images that ease the process of reproducibility. There have been various attempts to encourage reproducibility.

- [NAACL'22 Reproducibility Track](https://naacl2022-reproducibility-track.github.io/tutorial/){:target="_blank"}
- [RESCIENCE C](http://rescience.githb.io/){:target="_blank"}

It is always a good idea to do experiments inside the Docker container so that the image of the container can be shared at the end. This would give the end users the same environment for conducting experiments and reduce a lot of environment setup time.

[DockerHub]: https://hub.docker.com/

Use the following steps to create and publish a Docker image for your project:

**Step.1.a**: Check for the image of interest locally.
{% highlight bash %}
docker images
{% endhighlight %}

**Step.1.b**: If none, find an image of choice from [DockerHub] or any other source.


**Step.2**: Run the Docker image as a container.
{% highlight bash %}
docker run --gpus all -id --rm \
-v <cloned-repo>:/workspace \
--name <container-name> <docker-image>
{% endhighlight %}

**Step.3**: Get inside the container.
{% highlight bash %}
docker exec -it <container-name> /bin/bash
{% endhighlight %}

**Step.4**: Do the necessary changes, i.e., copy files, install packages, etc.

**Step.5**: Commit the changes.
{% highlight bash %}
docker commit \
--author <author-email> \
--message <commit-message> 
<container-name>
{% endhighlight %}

**Step.6**: Check for the IMAGE-ID.
{% highlight bash %}
docker ps # get IMAGE-ID
{% endhighlight %}

**Step.7**: Tag the IMAGE-ID with the local-name.
{% highlight bash %}
docker tag <IMAGE-ID> <local-name>
{% endhighlight %}

**Step.8**: Login using [DockerHub] username and password.
{% highlight bash %}
docker login -u <username>
# enter password on prompt
{% endhighlight %}


**Step.9**: Create a repository on [DockerHub] before proceeding, i.e. `<username>/<repo>`.

**Step.10**: Tag IMAGE-ID with [DockerHub] `<username>/<repo>`. 
{% highlight bash %}
docker tag <IMAGE-ID> <username>/<repo>:<tag>
{% endhighlight %}

**Step.11**: Push the image to [DockerHub].
{% highlight bash %}
docker push <username>/<repo>
{% endhighlight %}

<br><br>
Feel free to reach out in case you have a query. You are always welcome. <br>
Please post it as a tweet to
[@jis_padalunkal](https://twitter.com/jis_padalunkal){:target="_blank"}, and I will definitely try to answer it.

{% highlight python %}
@jis_padalunkal #askjishnu <your question>
{% endhighlight %}
