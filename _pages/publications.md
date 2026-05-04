---
layout: page
permalink: /publications/
title: Publications
seo_description: Publications by Jishnu Jaykumar Padalunkal — robot learning, few-shot learning, and robot perception. Includes FewSOL (ICRA 2023), Proto-CLIP (IROS 2024), iTeach, HRT1, and more.
description: "<a href='https://scholar.google.com/citations?user=08esT74AAAAJ&hl=en&&sortby=pubdate' target='_blank'><b class='google-scholar-link'>Google Scholar</b></a> | * denotes equal contribution and joint lead authorship."
years: [ 2026, 2025, 2024, 2023, 2021, 2018 ]
nav: true
nav_order: 1
---

<div class="publications">

{% for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>
