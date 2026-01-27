interface Props {
  size?: 'small' | 'large'
  showText?: boolean
}

export default function Logo({ size = 'small', showText = true }: Props) {
  const iconSize = size === 'small' ? 'w-8 h-8' : 'w-16 h-16'
  const textSize = size === 'small' ? 'text-base font-bold' : 'text-3xl font-bold'

  return (
    <div className="flex items-center gap-2">
      <img 
        src="/Logo.png" 
        alt="Logo" 
        className={`${iconSize} relative flex-shrink-0`}
      />
      
      {showText && (
        <div>
          <h1 className={`${textSize} text-gray-900 dark:text-white leading-tight whitespace-nowrap`}>
            Days Since I Quit
          </h1>
          {size === 'large' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track your progress onchain
            </p>
          )}
        </div>
      )}
    </div>
  )
}