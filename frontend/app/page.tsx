import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function Home() {
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

          <h2 className=" text-2xl text-[var(--color-accent)] text-center font-semibold tracking-wide">
            ---- <span className="mx-2">人生の証人達</span> ----
          </h2>
          <Button href="/works" label="作品を見る  >" className="mt-8" />
        </div>
      </section>
      <section>
      </section>
  </>
  );
}
