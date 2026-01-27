interface Props {
  size?: 'small' | 'large'
  showText?: boolean
}

export default function Logo({ size = 'small', showText = true }: Props) {
  const iconSize = size === 'small' ? 'w-8 h-8' : 'w-16 h-16'
  const textSize = size === 'small' ? 'text-xl' : 'text-3xl'


  return (
    <div className="flex items-center gap-3">
      {/* public/Logo.png */}
      <img 
        src="/Logo.png" 
        alt="Logo" 
        className={`${iconSize} relative flex-shrink-0`}
      />
      
      {showText && (
        <div>
          <h1 className={`${textSize} font-bold text-gray-900 dark:text-white leading-tight`}>
            Days Since I Quit
          </h1>
          { showText && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track your progress onchain
            </p>
          )}
        </div>
      )}
    </div>
  )
}