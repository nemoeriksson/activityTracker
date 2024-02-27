import { Chart, type ChartConfiguration } from 'chart.js/auto';

const tiers = {
    0: 'Beginner',
    25: 'Interested',
    50: 'Enthusiast',
    100: 'Trained',
    250: 'Athlete',
    500: 'Professional'
}

export function getTier(points:number){
    let result = '';
    Object.entries(tiers).forEach(([pointRequirement, title]) => {
        if (points >= parseInt(pointRequirement)){
            result = title;
        }
    });
    return result;
}

export async function generateRadarChart(user:any, ctx:CanvasRenderingContext2D){
	const data = {
		labels: [
			'Strength',
			'Endurance',
			'Yoga',
			'Cardio',
			'Other'
		],
		datasets: [{
			data: [25, 20, 50, 10, 0],
			fill: true,
			backgroundColor: '#8039df40',
			borderColor: '#8039df'
		}]
	  };
	const config:ChartConfiguration = {
		type: 'radar',
		data: data,
		options: {
		  	elements: {
				line: {
			  		borderWidth: 2
				}
		  	},
			plugins: {
				legend: {
					display: false
				},
				tooltip: {
					enabled: false
				},
				title: {
					text: 'Category Split',
					display: true,
					font: {
						size: 20
					},
					align: 'start',
					color: '#000'
				}
			},
			scales: {
				r: {
					suggestedMin: 0,
					ticks: {
						stepSize: 10,
						color: '#000'
					},
					pointLabels: {
						font: {
							size: 16,
						},
						color: '#000',
					}
				}
			}
		},
	};
	const chart = new Chart(ctx, config);
}
