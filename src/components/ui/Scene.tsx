import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
const Atmosphere = lazy(() => import("../3d/Atmosphere"));
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div
        className="sphere-fallback"
        aria-label="Static orbital illustration"
      />
    ) : (
      this.props.children
    );
  }
}
export function Scene({
  sphere = false,
  reduced = false,
  low = false,
}: {
  sphere?: boolean;
  reduced?: boolean;
  low?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mobile, setMobile] = useState(
    () => matchMedia("(max-width: 600px)").matches,
  );
  useEffect(() => {
    const q = matchMedia("(max-width: 600px)");
    const change = () => setMobile(q.matches);
    q.addEventListener("change", change);
    const observer = new IntersectionObserver(
      (es) => setVisible(es[0].isIntersecting),
      { rootMargin: "120px" },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      q.removeEventListener("change", change);
    };
  }, []);
  return (
    <div
      ref={root}
      className={sphere ? "sphere-canvas" : "atmosphere"}
      aria-hidden="true"
    >
      {low || mobile || !visible ? (
        <div className={sphere ? "sphere-fallback" : ""} />
      ) : (
        <SceneBoundary>
          <Suspense fallback={<div className="sphere-fallback" />}>
            <Atmosphere sphere={sphere} reduced={reduced} />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
