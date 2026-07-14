---
title: Your Post Title Here
date: 2026-07-14
summary: One sentence, plain-language summary of the post shown on the blog list page.
tags: [research, notes]
featured: false
author: Letian Wang
---

Write your post body here using standard Markdown. Everything below the front
matter is rendered client-side, so you can use the full feature set described below.

## Headings become the table of contents

Any `##` or `###` heading in the body is automatically picked up to build the
sticky table of contents on the right side of the article, with scroll-spy
highlighting of the current section.

### A sub-section

Sub-headings (`###`) are nested one level deeper in the table of contents.

## Text and emphasis

Regular paragraphs, **bold text**, *italic text*, and [links](https://example.com)
all work as expected.

## Code blocks

Fenced code blocks are syntax highlighted automatically:

```python
def reading_time(words, wpm=200):
    return max(1, round(words / wpm))
```

## Images with captions

Add a caption by putting the caption text in the image's title attribute:

![Alt text describing the image](../../images/example.jpg "This text becomes the figure caption")

## Videos

Link directly to a video file (.mp4, .webm, .ogv) using normal image syntax and
it will automatically be rendered as an inline HTML5 video player with the same
caption support:

![Alt text for the video](../../images/example.mp4 "This text becomes the video caption")

## Equations

Inline math like $E = mc^2$ and display math both render with KaTeX:

$$
a^2 + b^2 = c^2
$$

## Front matter reference

- `title`: post title, shown as the large H1 and in card lists.
- `date`: ISO date (YYYY-MM-DD), used for sorting and the human-readable date.
- `summary`: one sentence shown on the blog list page and used for SEO/social meta tags.
- `tags`: a bracketed, comma-separated list, e.g. [vision, scaling]. Used for tag filtering.
- `featured`: true or false, true shows a small featured badge on the card.
- `author`: defaults to Letian Wang if omitted.

Reading time is computed automatically from the word count, you do not need to set it.
