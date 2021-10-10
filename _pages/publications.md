---
layout: page
permalink: /publications/
title: Publications
description: "Google Scholar: <a><hreaf='https://scholar.google.com/citations?user=08esT74AAAAJ&hl=en' target='_blank'>08esT74AAAAJ</a> <br>* denotes equal contribution and joint lead authorship."
years: [ 2021, 2018, 2017 ]
nav: true
---

<div class="publications">

{% for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>
