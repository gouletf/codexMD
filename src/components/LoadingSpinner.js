import React from "react"

export default function LoadingSpinner() {

	return (
		<div className="z-10">
			<div class="relative h-32 bg-blue-400">
				<div class="fixed inset-0 flex items-center justify-center">
					<svg width="10vw" height="10vh" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
						<circle cx="50" cy="50" fill="none" stroke="#00d5ff" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138">
						<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
						</circle>
					</svg>
				</div>
			</div>
		</div>
	)
}