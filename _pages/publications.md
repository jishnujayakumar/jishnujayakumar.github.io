---
layout: page
permalink: /publications/
title: Publications
description: "Google Scholar: <a href='https://scholar.google.com/citations?user=08esT74AAAAJ&hl=en&&sortby=pubdate' target='_blank'>08esT74AAAAJ</a> | * denotes equal contribution and joint lead authorship."
years: [ 2023, 2021, 2018 ]
nav: true
---

<div class="publications">

{% for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>
