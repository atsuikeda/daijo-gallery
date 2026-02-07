import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function Home() {
  const subTitleClass = `
    flex items-center justify-center
    text-xl md:text-2xl font-semibold tracking-wide
    text-[var(--color-text)]
    mt-4
    before:content-['']
    before:w-70
    before:h-10
    before:block
    before:flex-1 before:h-px
    before:bg-[var(--color-text)]/60
    before:mr-1 md:before:mr-4

    after:content-['']
    after:block
    after:flex-1 after:h-px
    after:bg-[var(--color-text)]/60
    after:ml-3 md:after:ml-4
  `
  return (
    <>
      <section className="relative h-[70vh] w-full overflow-hidden">

        {/* 背景画像 */}
        <Image
          src="/main.png"
          alt="山田大乗 個展 メインヴィジュアル"
          fill
          className="object-cover"
          priority
        />

        {/* 画像に薄いフィルター */}
        <div className="absolute inset-0 bg-white/40" />

        {/* タイトルエリア */}
        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          <h1 className="text-8xl font-medium text-[var(--color-main)] tracking-wide">
            山田 個展
          </h1>

          <h2 className={subTitleClass}>
            人生の証人達
          </h2>
          <Button href="/works" label="作品を見る" className="mt-8" />
        </div>
      </section>
      <section>
      </section>
  </>
  );
}
