import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { getMainNodes } from "@/lib/nodes";
import { getAllArticles } from "@/lib/content";
import { CATEGORY_DESCRIPTIONS } from "@/lib/categoryMeta";
import styles from "./CategoryCards.module.css";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "webp", "png"];

// public/categories/ にカテゴリーIDの名前で画像が置かれていれば、そのパスを返す
function findImage(id: string): string | null {
  for (const ext of IMAGE_EXTENSIONS) {
    const file = path.join(process.cwd(), "public", "categories", `${id}.${ext}`);
    if (fs.existsSync(file)) return `/categories/${id}.${ext}`;
  }
  return null;
}

export default function CategoryCards() {
  const categories = getMainNodes().filter(
    (n) => n.type === "category" || n.type === "etc-collector"
  );
  const articles = getAllArticles();

  return (
    <section className={styles.section} aria-label="研究分野">
      <ul className={styles.grid}>
        {categories.map((c) => {
          const image = findImage(c.id);
          const count = articles.filter((a) => a.categories?.includes(c.id)).length;
          const description = CATEGORY_DESCRIPTIONS[c.id];

          return (
            <li key={c.id}>
              <Link href={`/categories/${c.id}`} className={styles.card}>
                <div className={styles.thumb}>
                  {image && (
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(max-width: 559px) 100vw, (max-width: 959px) 50vw, 33vw"
                      className={styles.image}
                    />
                  )}
                </div>
                <div className={styles.body}>
                  <h2 className={styles.title}>{c.label}</h2>
                  {description && <p className={styles.description}>{description}</p>}
                  <p className={styles.count}>
                    {count > 0 ? `${count}本の記事` : "準備中"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
