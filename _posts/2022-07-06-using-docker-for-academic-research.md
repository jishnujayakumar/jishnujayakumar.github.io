---
layout: post
title: Using Docker for Academic Research
date: Wed 06 Jul 2022 06:54:24 PM CDT
description: Need for docker in academic research
jumbotron: ../../../assets/blog/docker-for-research.svg
jumbotron_alt: docker for academic research
tags: docker research
categories: research
---
<img src="../../../assets/blog/docker-for-research.svg" alt="docker for academic research" width="100%" height="150px" >
<center>Image made using logos available <a href='https://www.docker.com/company/newsroom/media-resources/' target="_blank">here</a>.</center><br>
<hr>
**Note**: *Reading this post needs familiarity with [Docker](https://www.docker.com/){:target="_blank"}. If you are new to the Docker world, I suggest taking a look [here](https://www.youtube.com/watch?v=iqqDU2crIEQ){:target="_blank"}*.


<!-- <hr> -->

Docker is a well-known tool. Although it is used prominently in the industry, there is a usage gap when talking about academic research. The main advantage of using Docker is that it allows the creation of images that ease the process of reproducibility. There have been various attempts to encourage reproducibility.

- [NAACL'22 Reproducibility Track](https://naacl2022-reproducibility-track.github.io/tutorial/){:target="_blank"}
- [RESCIENCE C](http://rescience.githb.io/){:target="_blank"}

It is always a good idea to do experiments inside docker container so that at the end the image of the container can be shared. This would not only give the end users the same environment for conducting experiments but also reduce a lot of environment setup time.

Writing under process ...


{% highlight bash %}

docker images

docker run --gpus all -id --rm -v ~/Documents/github/meta-dataset:/workspace --name meta-dataset_jishnu__01  nvcr.io/nvidia/tensorflow:21.12-tf1-py3
docker exec -it meta-dataset_jishnu__01 /bin/bash

docker commit --author jishnu.p@utdallas.edu --message "Meta-dataset including FewSOL dataset and it's related code setup" meta-dataset_jishnu__01

docker ps # get IMAGE-ID
docker tag <IMAGE-ID> fewsol-meta-dataset

docker login -u <username>

docker tag <IMAGE-ID> <username>/<repo>:<tag>

docker push <username>/<repo>
{% endhighlight %}


Feel free to reach out in case you have a query. You are always welcome. <br>
Please post it in the form of a tweet to
[@jis_padalunkal](https://twitter.com/jis_padalunkal){:target="_blank"}

{% highlight python %}
@jis_padalunkal #askjishnu <your question>
{% endhighlight %}


I will definitely try to answer it.
