import React, { useState, useEffect } from 'react'

const UniqueHighlight = ({
	children,
	expertise,
	opacity = 0.3
}: {
	children: React.ReactNode
	expertise: number
	opacity?: number
}) => {
	const [filterId, setFilterId] = useState('')
	const [baseFrequency, setBaseFrequency] = useState('0 0.15')

	const getColor = (expertise: number) => {
		switch (expertise) {
			case 1:
				return '#d946ef'
			case 2:
				return '#06b6d4'
			case 3:
				return '#84cc16'
			case 4:
				return '#facc15'
			case 5:
				return '#a78bfa'
			default:
				return '#ff6db7'
		}
	}

	useEffect(() => {
		const uniqueId = `marker-shape-${Math.random().toString(36).substr(2, 9)}`
		setFilterId(uniqueId)
		const frequencyX = Math.random() * 0.002 + 0.005
		const frequencyY = Math.random() * 0.15 + 0.005
		setBaseFrequency(`${frequencyX} ${frequencyY}`)
	}, [])

	return (
		<div className="unique-highlight-wrapper">
			<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
				<defs>
					<filter id={filterId}>
						<feTurbulence
							type="fractalNoise"
							baseFrequency={baseFrequency}
							numOctaves="1"
							result="warp"
						/>
						<feDisplacementMap
							xChannelSelector="R"
							yChannelSelector="G"
							scale="30"
							in="SourceGraphic"
							in2="warp"
						/>
					</filter>
				</defs>
			</svg>
			<div
				className="highlight-background"
				style={{
					filter: `url(#${filterId})`,
					backgroundColor: getColor(expertise),
					opacity: opacity,
					border: `2px solid ${getColor(expertise)}`
				}}
			></div>
			<div className="highlight-content">{children}</div>
		</div>
	)
}

export default UniqueHighlight
