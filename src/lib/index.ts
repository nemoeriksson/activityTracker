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

function filterFor(list:string[], category:string): number{
	return list.filter(el => el == category).length;
}

export async function generateRadarChart(performances:any, ctx:CanvasRenderingContext2D){
	const activityCategories = performances.map((p:any) => p.aktivitet.category);	
	const length = activityCategories.length;

	const stats = [
		100 * filterFor(activityCategories, 'Strength') / length,
		100 * filterFor(activityCategories, 'Endurance') / length,
		100 * filterFor(activityCategories, 'Yoga') / length,
		100 * filterFor(activityCategories, 'Cardio') / length,
		100 * filterFor(activityCategories, 'Other') / length
	].map(val => Math.max(val, 5));

	const data = {
		labels: [
			'Strength',
			'Endurance',
			'Yoga',
			'Cardio',
			'Other'
		],
		datasets: [{
			data: stats,
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
					suggestedMax: Math.min(
						Math.max(
							50, 
							Math.ceil(Math.max(...stats)/10)*10 + 10
						), 
						100
					),
					ticks: {
						stepSize: Math.max(...stats) > 50 ? 20 : 10,
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

