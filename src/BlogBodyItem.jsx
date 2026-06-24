function parseInlineStyle(styleString) {
  if (!styleString) return {};

  return Object.fromEntries(
    styleString
      .split(";")
      .filter(Boolean)
      .map((rule) => {
        const colonIndex = rule.indexOf(":");
        if (colonIndex === -1) return null;

        const property = rule.slice(0, colonIndex).trim();
        const value = rule.slice(colonIndex + 1).trim();
        const camelProperty = property.replace(/-([a-z])/g, (_, char) =>
          char.toUpperCase()
        );

        return [camelProperty, value];
      })
      .filter(Boolean)
  );
}

function parseImgFromElement(img) {
  return {
    src: img.getAttribute("src"),
    alt: img.getAttribute("alt") || "",
    className: img.getAttribute("class") || img.getAttribute("className") || "",
    style: parseInlineStyle(img.getAttribute("style")),
  };
}

function parseImgTags(content) {
  const trimmed = content.trim();
  if (!/<img\b/i.test(trimmed)) return null;

  const container = new DOMParser()
    .parseFromString(`<div>${trimmed}</div>`, "text/html")
    .body.firstChild;

  const images = Array.from(container.querySelectorAll("img"));
  if (images.length === 0) return null;

  const isImageOnly = Array.from(container.childNodes).every(
    (node) =>
      (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) ||
      node.nodeName === "IMG"
  );

  if (!isImageOnly) return null;

  return images.map(parseImgFromElement);
}

function renderImage(image, key) {
  const imageClassName = ["blog-body-image", image.className]
    .filter(Boolean)
    .join(" ");

  return (
    <figure key={key} className="blog-body-figure">
      <img
        className={imageClassName}
        src={image.src}
        alt={image.alt}
        style={image.style}
      />
      {image.alt && (
        <figcaption className="blog-body-caption">{image.alt}</figcaption>
      )}
    </figure>
  );
}

function parseLinkTag(content) {
  const trimmed = content.trim();
  if (!/^<a\b/i.test(trimmed)) return null;

  const anchor = new DOMParser()
    .parseFromString(trimmed, "text/html")
    .querySelector("a");

  if (!anchor) return null;

  return {
    href: anchor.getAttribute("href"),
    innerHTML: anchor.innerHTML,
    style: parseInlineStyle(anchor.getAttribute("style")),
    target: anchor.getAttribute("target"),
    rel: anchor.getAttribute("rel"),
  };
}

function parseHeaderTag(content) {
  const trimmed = content.trim();
  if (!/^<h[1-6]\b/i.test(trimmed)) return null;

  const header = new DOMParser()
    .parseFromString(trimmed, "text/html")
    .querySelector("h1,h2,h3,h4,h5,h6");

  if (!header) return null;

  return {
    level: header.tagName.toLowerCase(),
    text: header.textContent,
    style: parseInlineStyle(header.getAttribute("style")),
  };
}

function parseBoldTag(content) {
  const trimmed = content.trim();
  if (!/^<(b|strong)\b/i.test(trimmed)) return null;

  const bold = new DOMParser()
    .parseFromString(trimmed, "text/html")
    .querySelector("b,strong");

  if (!bold) return null;

  return {
    innerHTML: bold.innerHTML,
    style: parseInlineStyle(bold.getAttribute("style")),
  };
}

function parseItalicTag(content) {
  const trimmed = content.trim();
  if (!/^<(i|em)\b/i.test(trimmed)) return null;

  const italic = new DOMParser()
    .parseFromString(trimmed, "text/html")
    .querySelector("i,em");

  if (!italic) return null;

  return {
    innerHTML: italic.innerHTML,
    style: parseInlineStyle(italic.getAttribute("style")),
  };
}

function renderNode(node, key) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  const style = parseInlineStyle(node.getAttribute?.("style"));

  if (node.nodeName === "B" || node.nodeName === "STRONG") {
    return (
      <strong key={key} className="blog-body-bold" style={style}>
        {Array.from(node.childNodes).map((child, i) => renderNode(child, i))}
      </strong>
    );
  }

  if (node.nodeName === "I" || node.nodeName === "EM") {
    return (
      <em key={key} className="blog-body-italic" style={style}>
        {Array.from(node.childNodes).map((child, i) => renderNode(child, i))}
      </em>
    );
  }

  if (node.nodeName === "A") {
    return (
      <a
        key={key}
        href={node.getAttribute("href")}
        className="blog-body-link"
        style={style}
        target={node.getAttribute("target") || undefined}
        rel={node.getAttribute("rel") || undefined}
      >
        {Array.from(node.childNodes).map((child, i) => renderNode(child, i))}
      </a>
    );
  }

  return node.textContent;
}

function renderInlineNodes(content) {
  if (!/<(a|b|strong|i|em)\b/i.test(content)) return content;

  const container = new DOMParser()
    .parseFromString(`<div>${content}</div>`, "text/html")
    .body.firstChild;

  return Array.from(container.childNodes).map((node, i) => renderNode(node, i));
}

export default function BlogBodyItem({ content }) {
  const images = parseImgTags(content);

  if (images?.length) {
    if (images.length === 1) {
      return renderImage(images[0], 0);
    }

    return (
      <div className="blog-body-figure-row">
        {images.map((image, i) => renderImage(image, i))}
      </div>
    );
  }

  const link = parseLinkTag(content);

  if (link?.href) {
    return (
      <p>
        <a
          href={link.href}
          className="blog-body-link"
          style={link.style}
          target={link.target || undefined}
          rel={link.rel || undefined}
        >
          {renderInlineNodes(link.innerHTML)}
        </a>
      </p>
    );
  }

  const header = parseHeaderTag(content);

  if (header) {
    const HeadingTag = header.level;

    return (
      <HeadingTag
        className={`blog-body-heading blog-body-${header.level}`}
        style={header.style}
      >
        {header.text}
      </HeadingTag>
    );
  }

  const bold = parseBoldTag(content);

  if (bold) {
    return (
      <p>
        <strong className="blog-body-bold" style={bold.style}>
          {renderInlineNodes(bold.innerHTML)}
        </strong>
      </p>
    );
  }

  const italic = parseItalicTag(content);

  if (italic) {
    return (
      <p>
        <em className="blog-body-italic" style={italic.style}>
          {renderInlineNodes(italic.innerHTML)}
        </em>
      </p>
    );
  }

  return <p>{renderInlineNodes(content)}</p>;
}
