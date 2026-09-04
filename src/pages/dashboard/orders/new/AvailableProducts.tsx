import { useEffect, useMemo, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Card } from "../../../../components/atoms/Card"
import { useTheme } from "../../../../context/ThemeContext"
import type { TMenu } from "../../../../types/Menu"
import type { TProduct } from "../../../../types/Product"
import { categoryColorVars } from "../../../../utils/categoryColor"
import { cn, formatCurrency } from "../../../../utils/format"

const ALL_CATEGORY = "all" as const

const sortProducts = (list: TProduct[]) =>
  [...list].sort((a, b) => a.position - b.position || a.name.localeCompare(b.name, "es"))

type Props = {
  products: TProduct[]
  menus: TMenu[]
  addedCounts: Record<number, number>
  onAdd: (product: TProduct) => void
  onDecrement?: (product: TProduct) => void
  compact?: boolean
  showDescription?: boolean
  emptyMessage?: string
  className?: string
  /**
   * `panel` — nested product list scroll (POS / tablet split panes).
   * `page` — document scrolls; menu chips stay sticky and only pan horizontally (mobile /pedir).
   */
  scrollContainer?: "panel" | "page"
  /** Drop the Card chrome when the parent already provides a pane. */
  framed?: boolean
  /** Extra columns on large screens (fast-track POS). */
  density?: "default" | "wide"
  /**
   * `filter` — chips hide other menus (POS).
   * `sections` — chips jump to a heading; the full catalog stays grouped (public /pedir).
   */
  layout?: "filter" | "sections"
}

export const AvailableProducts = ({
  products,
  menus,
  addedCounts,
  onAdd,
  onDecrement,
  compact = false,
  showDescription = false,
  emptyMessage = "No hay productos activos. Activa un menú y sus productos primero.",
  className,
  scrollContainer = "panel",
  framed = true,
  density = "default",
  layout = "filter",
}: Props) => {
  const { isDark } = useTheme()
  const [categoryId, setCategoryId] = useState<typeof ALL_CATEGORY | number>(ALL_CATEGORY)

  const categories = useMemo(
    () =>
      menus
        .filter((menu) => menu.active)
        .filter((menu) => products.some((product) => product.menu_id === menu.id))
        .slice()
        .sort((a, b) => a.id - b.id),
    [menus, products],
  )

  const colorIndexByMenuId = useMemo(() => {
    const map = new Map<number, number>()
    categories.forEach((menu, index) => map.set(menu.id, index))
    return map
  }, [categories])

  const visibleProducts = useMemo(() => {
    const filtered =
      categoryId === ALL_CATEGORY
        ? products
        : products.filter((product) => product.menu_id === categoryId)
    return sortProducts(filtered)
  }, [categoryId, products])

  const sections = useMemo(
    () =>
      categories
        .map((menu) => ({
          menu,
          products: sortProducts(products.filter((product) => product.menu_id === menu.id)),
        }))
        .filter((section) => section.products.length > 0),
    [categories, products],
  )

  const skipSpy = useRef(false)

  const scrollToCategory = (id: typeof ALL_CATEGORY | number) => {
    setCategoryId(id)
    skipSpy.current = true
    window.setTimeout(() => {
      skipSpy.current = false
    }, 700)
    if (id === ALL_CATEGORY) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    document.getElementById(`menu-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
    document.getElementById(`chip-${id}`)?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    })
  }

  useEffect(() => {
    if (layout !== "sections" || sections.length === 0) return

    const nodes = sections
      .map((section) => document.getElementById(`menu-${section.menu.id}`))
      .filter((node): node is HTMLElement => node != null)
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (skipSpy.current) return
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const id = visible[0]?.target.id
        if (!id) return
        const menuId = Number(id.replace("menu-", ""))
        if (Number.isFinite(menuId)) setCategoryId(menuId)
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0.1 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [layout, sections])

  const pageScroll = scrollContainer === "page"
  const frameClass = cn(
    framed && "overflow-hidden border-2 !border-brand/50",
    pageScroll ? "" : "flex h-full min-h-0 flex-col",
    className,
  )

  const body = (
    <>
      <div
        className={cn(
          "shrink-0",
          framed ? "border-b border-gray-100" : "border-b border-gray-200/80",
          pageScroll && framed && "sticky top-0 z-20 bg-surface-elevated",
          pageScroll && !framed && "sticky top-0 z-20 bg-surface",
          compact ? "py-1.5" : "py-3",
          compact && framed && "px-2",
          !compact && framed && "px-4",
        )}
      >
        <div
          role="tablist"
          aria-label="Menús"
          className={cn(
            "flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-0.5",
            "touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {layout === "sections" ? null : (
            <CategoryChip
              label="Todos"
              selected={categoryId === ALL_CATEGORY}
              compact={compact}
              onSelect={() => setCategoryId(ALL_CATEGORY)}
            />
          )}
          {categories.map((menu, index) => (
            <CategoryChip
              key={menu.id}
              id={`chip-${menu.id}`}
              label={menu.name}
              selected={categoryId === menu.id || (layout === "sections" && categoryId === ALL_CATEGORY && index === 0)}
              compact={compact}
              colorVars={categoryColorVars(index, isDark)}
              onSelect={() =>
                layout === "sections" ? scrollToCategory(menu.id) : setCategoryId(menu.id)
              }
            />
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500">{emptyMessage}</p>
      ) : visibleProducts.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500">No hay productos en esta categoría.</p>
      ) : (
        <div
          className={cn(
            pageScroll
              ? framed
                ? "p-2"
                : "pt-3"
              : cn("min-h-0 flex-1 overflow-y-auto", compact ? "p-2" : "p-3"),
          )}
        >
          {layout === "sections"
            ? sections.map(({ menu, products: sectionProducts }, index) => (
                <section
                  key={menu.id}
                  id={`menu-${menu.id}`}
                  className={cn("scroll-mt-[3.75rem]", index > 0 && "mt-5")}
                >
                  <h2 className="px-1 pb-2 text-sm font-semibold text-ink">{menu.name}</h2>
                  <ProductGrid
                    products={sectionProducts}
                    addedCounts={addedCounts}
                    colorIndexByMenuId={colorIndexByMenuId}
                    isDark={isDark}
                    compact={compact}
                    showDescription={showDescription}
                    density={density}
                    onAdd={onAdd}
                    onDecrement={onDecrement}
                  />
                </section>
              ))
            : (
                <ProductGrid
                  products={visibleProducts}
                  addedCounts={addedCounts}
                  colorIndexByMenuId={colorIndexByMenuId}
                  isDark={isDark}
                  compact={compact}
                  showDescription={showDescription}
                  density={density}
                  onAdd={onAdd}
                  onDecrement={onDecrement}
                />
              )}
        </div>
      )}
    </>
  )

  if (!framed) {
    return <div className={frameClass}>{body}</div>
  }

  return <Card className={frameClass}>{body}</Card>
}

type CategoryChipProps = {
  id?: string
  label: string
  selected: boolean
  onSelect: () => void
  compact?: boolean
  colorVars?: ReturnType<typeof categoryColorVars>
}

const CategoryChip = ({ id, label, selected, onSelect, compact = false, colorVars }: CategoryChipProps) => (
  <button
    type="button"
    id={id}
    onClick={onSelect}
    style={colorVars}
    className={cn(
      "inline-flex shrink-0 items-center gap-2 rounded-full font-semibold transition",
      compact ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm",
      colorVars
        ? selected
          ? "bg-[var(--cat-solid)] text-white shadow-sm"
          : "bg-[var(--cat-fill)] text-ink hover:brightness-95"
        : selected
          ? "bg-brand text-white shadow-sm"
          : "bg-gray-100 text-ink hover:bg-gray-200",
    )}
  >
    {colorVars ? (
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ background: selected ? "currentColor" : "var(--cat-solid)" }}
        aria-hidden
      />
    ) : null}
    {label}
  </button>
)

type ProductGridProps = {
  products: TProduct[]
  addedCounts: Record<number, number>
  colorIndexByMenuId: Map<number, number>
  isDark: boolean
  compact: boolean
  showDescription: boolean
  density: "default" | "wide"
  onAdd: (product: TProduct) => void
  onDecrement?: (product: TProduct) => void
}

const ProductGrid = ({
  products,
  addedCounts,
  colorIndexByMenuId,
  isDark,
  compact,
  showDescription,
  density,
  onAdd,
  onDecrement,
}: ProductGridProps) => (
  <div
    className={cn(
      "grid",
      density === "wide"
        ? "grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 phone:grid-cols-1 phone:gap-1.5"
        : compact
          ? showDescription
            ? "grid-cols-1 gap-2"
            : "grid-cols-1 gap-1.5"
          : "grid-cols-2 gap-3 phone:grid-cols-1 phone:gap-1.5",
    )}
  >
    {products.map((product) => {
      const index = colorIndexByMenuId.get(product.menu_id)
      return (
        <ProductTile
          key={product.id}
          product={product}
          addedCount={addedCounts[product.id] ?? 0}
          compact={compact}
          showDescription={showDescription}
          colorVars={index == null ? undefined : categoryColorVars(index, isDark)}
          onAdd={() => onAdd(product)}
          onDecrement={onDecrement ? () => onDecrement(product) : undefined}
        />
      )
    })}
  </div>
)

type ProductTileProps = {
  product: TProduct
  addedCount: number
  onAdd: () => void
  onDecrement?: () => void
  compact?: boolean
  showDescription?: boolean
  colorVars?: ReturnType<typeof categoryColorVars>
}

const ProductTile = ({
  product,
  addedCount,
  onAdd,
  onDecrement,
  compact = false,
  showDescription = false,
  colorVars,
}: ProductTileProps) => {
  const badge = product.combo ? "Combo" : null
  const description = showDescription ? product.description?.trim() : ""
  const listWithCopy = compact && showDescription

  if (listWithCopy) {
    return (
      <div
        style={colorVars}
        className={cn(
          "relative flex items-center gap-3 rounded-xl border bg-surface-elevated px-3 py-3 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
          colorVars ? "border-[var(--cat-border)]" : "border-gray-200/80",
          addedCount > 0 && "border-[var(--cat-solid)]",
        )}
      >
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{product.name}</p>
          {description ? (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">{description}</p>
          ) : null}
          {badge ? (
            <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
              {badge}
            </span>
          ) : null}
          <p className="mt-1.5 text-sm font-bold tabular-nums text-brand">
            {formatCurrency(product.price)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-surface-elevated text-ink transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={addedCount < 1 || !onDecrement}
            onClick={onDecrement}
            aria-label={`Quitar ${product.name}`}
          >
            <FontAwesomeIcon icon={faMinus} className="size-2.5" aria-hidden />
          </button>
          <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-ink">
            {addedCount}
          </span>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-surface-elevated text-ink transition hover:bg-gray-50"
            onClick={onAdd}
            aria-label={`Agregar ${product.name}`}
          >
            <FontAwesomeIcon icon={faPlus} className="size-2.5" aria-hidden />
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      style={colorVars}
      className={cn(
        "relative flex rounded-xl border bg-surface-elevated text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition",
        "active:scale-[0.98]",
        colorVars ? "border-[var(--cat-border)]" : "border-gray-200/80",
        addedCount > 0 && "border-[var(--cat-solid)]",
        compact
          ? "min-h-16 flex-row items-center gap-2 px-3 py-2.5"
          : "min-h-[5.5rem] flex-col justify-between px-3 py-2.5 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(12,107,61,0.12)] phone:min-h-12 phone:flex-row phone:items-center phone:gap-2 phone:px-3 phone:py-2",
      )}
    >
      {addedCount > 0 && !compact ? (
        <span
          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white phone:hidden"
          style={{ background: "var(--cat-solid)" }}
        >
          {addedCount}
        </span>
      ) : null}
      <p
        className={cn(
          "font-semibold leading-snug text-ink",
          compact ? "min-w-0 flex-1 line-clamp-2 text-sm" : "line-clamp-2 text-sm",
          addedCount > 0 && !compact && "pr-7",
          !compact && "phone:min-w-0 phone:flex-1 phone:truncate phone:text-sm phone:line-clamp-none phone:pr-0",
        )}
      >
        {product.name}
      </p>
      <div className={cn("flex items-center gap-2", compact ? "shrink-0" : "mt-2 items-end justify-between", !compact && "phone:mt-0 phone:shrink-0 phone:items-center")}>
        {badge ? (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            {badge}
          </span>
        ) : null}
        {compact ? null : (
          <p className="text-sm font-bold tabular-nums text-brand">
            {formatCurrency(product.price)}
          </p>
        )}
        {addedCount > 0 && compact ? (
          <span
            className="flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: "var(--cat-solid)" }}
          >
            {addedCount}
          </span>
        ) : null}
        {addedCount > 0 && !compact ? (
          <span
            className="hidden size-6 items-center justify-center rounded-full text-[11px] font-bold text-white phone:flex"
            style={{ background: "var(--cat-solid)" }}
          >
            {addedCount}
          </span>
        ) : null}
      </div>
    </button>
  )
}
