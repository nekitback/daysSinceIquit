interface LogoProps {
    size?: 'small' | 'medium' | 'large'
    showText?: boolean
  }
  
  export default function Logo({ size = 'medium', showText = true }: LogoProps) {
    const sizes = {
      small: 'w-10 h-10',
      medium: 'w-16 h-16',
      large: 'w-24 h-24',
    }
  
    const textSizes = {
      small: 'text-xs',
      medium: 'text-sm',
      large: 'text-base',
    }
  
    return (
      <div className="flex items-center gap-3">
        {/* Logo Circle - ПОЛНОСТЬЮ СИНИЙ, 4 НАДПИСИ ПО КРУГУ */}
        <div className={`${sizes[size]} relative flex-shrink-0`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Полностью синий круг */}
            <circle cx="50" cy="50" r="48" fill="#2563EB"/>
            
            {/* Пути для текста */}
            <defs>
              {/* Верхняя часть круга (по часовой) */}
              <path
                id="topCircle"
                d="M 10,50 A 40,40 0 0,1 90,50"
                fill="none"
              />
              
              {/* Нижняя часть круга (по часовой) */}
              <path
                id="bottomCircle"
                d="M 90,50 A 40,40 0 0,1 10,50"
                fill="none"
              />
              
              {/* Средний верхний круг */}
              <path
                id="middleTopCircle"
                d="M 15,50 A 35,35 0 0,1 85,50"
                fill="none"
              />
              
              {/* Средний нижний круг */}
              <path
                id="middleBottomCircle"
                d="M 85,50 A 35,35 0 0,1 15,50"
                fill="none"
              />
            </defs>
            
            {/* Текст 1 - Верхний внешний */}
            <text className="text-[6.5px] font-bold fill-white uppercase tracking-[0.2em]">
              <textPath href="#topCircle" startOffset="50%" textAnchor="middle">
                DAYS SINCE I QUIT
              </textPath>
            </text>
            
            {/* Текст 2 - Нижний внешний */}
            <text className="text-[6.5px] font-bold fill-white uppercase tracking-[0.2em]">
              <textPath href="#bottomCircle" startOffset="50%" textAnchor="middle">
                DAYS SINCE I QUIT
              </textPath>
            </text>
            
            {/* Текст 3 - Верхний средний */}
            <text className="text-[6.5px] font-bold fill-white uppercase tracking-[0.2em] opacity-80">
              <textPath href="#middleTopCircle" startOffset="50%" textAnchor="middle">
                DAYS SINCE I QUIT
              </textPath>
            </text>
            
            {/* Текст 4 - Нижний средний */}
            <text className="text-[6.5px] font-bold fill-white uppercase tracking-[0.2em] opacity-80">
              <textPath href="#middleBottomCircle" startOffset="50%" textAnchor="middle">
                DAYS SINCE I QUIT
              </textPath>
            </text>
          </svg>
        </div>
  
        {/* Text (optional) */}
        {showText && (
          <div>
            <h1 className={`${textSizes[size]} font-bold text-gray-900 leading-tight`}>
              Days Since I Quit
            </h1>
            <p className="text-xs text-gray-500">Track onchain</p>
          </div>
        )}
      </div>
    )
  }