import { Component, signal, computed, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

export type ProjectCategory = 'All' | 'Hospitality' | 'Residential' | 'Airbnb';

export interface Project {
  title: string;
  category: 'Hospitality' | 'Residential' | 'Airbnb';
  type: string;
  duration: string;
  image: string;
  alt: string;
  summary: string;
}

@Component({
  selector: 'app-projects',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly categories: ProjectCategory[] = ['All', 'Hospitality', 'Airbnb'];
  activeFilter = signal<ProjectCategory>('All');

  readonly projects: Project[] = [
    {
      title: 'Pub Refurbishment — London',
      category: 'Hospitality',
      type: 'Full fit-out',
      duration: '6 weeks',
      image: '/images/london_construction_project_1.webp',
      alt: 'Pub refurbishment completed by Workhorse Crew in London.',
      summary: 'Full strip-out and fit-out of a London pub. New bar, flooring, lighting and kitchen installation delivered in six weeks with zero trading days lost.'
    },
    {
      title: 'Airbnb Fit-Out — London',
      category: 'Airbnb',
      type: 'Airbnb fit-out & styling',
      duration: '2 weeks',
      image: '/images/london_construction_project_2.webp',
      alt: 'Airbnb property fit-out and styling by Workhorse Crew in London.',
      summary: 'Turnkey Airbnb renovation and guest-ready styling of a two-bedroom flat, boosting occupancy rates and nightly revenue for the landlord within weeks of completion.'
    },
    {
      title: 'Pub Refurbishment — London',
      category: 'Hospitality',
      type: 'Full fit-out',
      duration: '4 weeks',
      image: '/images/london_construction_project_3.webp',
      alt: 'Pub interior refurbishment completed by Workhorse Crew in London.',
      summary: 'Fast-track pub refurbishment including new seating layout, bar works, bespoke joinery and full redecoration — completed ahead of the client\'s reopening deadline.'
    }
  ];

  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    return filter === 'All' ? this.projects : this.projects.filter(p => p.category === filter);
  });

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle('Our Projects | Workhorse Crew London');
    meta.updateTag({ name: 'description', content: 'View Workhorse Crew\'s completed projects across London — pub refurbishments, Airbnb fit-outs and residential renovations delivered on time and on budget.' });
    meta.updateTag({ property: 'og:title', content: 'Our Projects | Workhorse Crew London' });
    meta.updateTag({ property: 'og:url', content: 'https://workhorsecrew.co.uk/projects' });

    this.route.queryParamMap.subscribe(params => {
      const cat = params.get('category');
      if (cat) {
        const normalised = (cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()) as ProjectCategory;
        if (this.categories.includes(normalised)) {
          this.activeFilter.set(normalised);
        }
      }
    });
  }

  setFilter(category: ProjectCategory) {
    this.activeFilter.set(category);
    this.router.navigate([], {
      queryParams: category === 'All' ? {} : { category: category.toLowerCase() },
      queryParamsHandling: 'replace'
    });
  }
}
