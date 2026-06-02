export default function PageCanvas({ children, className = '' }) {
  return (
    <div
      className={`px-margin-mobile md:px-gutter py-stack-lg max-w-container-max w-full mx-auto min-h-[calc(100vh-64px)] ${className}`}
    >
      {children}
    </div>
  )
}
