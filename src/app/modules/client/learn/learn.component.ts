import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Renderer2 } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { EventService } from "src/app/core/services/event.service";

@Component({
    selector: 'learn',
    templateUrl: 'learn.component.html',
    styleUrls: ['learn.component.scss']
})
export class LearnComponent {
    // url=""
    lang = "en"
    constructor(private http: HttpClient,
        private cookie: CookieService,
        private translate: TranslateService,
        private renderer: Renderer2,
        private el: ElementRef,
        private eventService:EventService
    ) {
    }
    options = {
        width: '100%',
        height: '1000',
        mode: '2',
        lang: 'ar',
        theme: 0
    };

    async ngOnInit() {
        this.lang = this.cookie.get('lang')
        this.options.lang = this.lang
        this.eventService.subscribe('changeMode',mode=>{
            this.options.theme = mode == 'dark' ? 1:0
            this.removeFrame()
            this.setFrame(this.options)
        })
        // this.url = `https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=week&timeZone=8&lang=${this.lang == 'en'?1:3}`
        this.setFrame(this.options)

        this.translate.onLangChange.subscribe(lang => {
            this.lang = lang.lang
            this.options.lang = this.lang
            this.removeFrame()
            this.setFrame(this.options)

        })
    }


    setFrame(options) {
        const economicCalendarWidget = this.el.nativeElement.querySelector('#economicCalendarWidget');

        // Create a new script element
        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'async', 'true');
        this.renderer.setAttribute(script, 'type', 'text/javascript');
        this.renderer.setAttribute(script, 'data-type', 'calendar-widget');
        this.renderer.setAttribute(script, 'src', 'https://www.tradays.com/c/js/widgets/calendar/widget.js?v=13');

        // Append the new script element to the DOM
        this.renderer.appendChild(economicCalendarWidget, script);

         // Set options as innerHTML of the script element
        script.innerHTML = JSON.stringify(options);
   
    }
    removeFrame() {
        const economicCalendarWidget = this.el.nativeElement.querySelector('#economicCalendarWidget');

        economicCalendarWidget.innerHTML = ""
    }
}


