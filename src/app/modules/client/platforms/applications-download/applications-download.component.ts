import { Component } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
    selector: 'applications-download',
    templateUrl: 'applications-download.component.html',
    styleUrls: ['applications-download.component.scss']
})
export class ApplicationsDownloadComponent {
    goTo(arg0: string) {
        window.location.href = arg0
    }
    apiUrl = environment.apiUrl
    // bread crumb items
    breadCrumbItems!: Array<{}>;
    masterSelected!: boolean;
    checkedList: any;

    //applications data
    MT4Data = [
        {
            id: 1,
            img: 'assets/images/platforms/windows.png',
            title: "Windows",
            btnTitle: 'Download',
            disabled: false,
            textContent: [
                "Spreads as low as 0.9 pips",
                "Trade with one click",
                "Technical analysis tools with 50 indicators and charting tools",
                "3 types of charts",
                "Micro lot accounts (optional)",
                "Hedging is allowed",
            ],
            url: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt4/mt4setup.exe?utm_source=www.metatrader4.com&utm_campaign=download'
        },
        // {
        //     id: 2,
        //     img: 'assets/images/platforms/macOS.png',
        //     title: "MAC",
        //     disabled: false,
        //     btnTitle: 'Download',
        //     textContent: "some text to explaint applications job and its benefits",
        //     url: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt4/MetaTrader4.dmg?utm_source=www.metatrader4.com&utm_campaign=download.mt4.macos'
        // },
        {
            id: 3,
            img: 'assets/images/platforms/android.png',
            title: "Android",
            disabled: false,
            btnTitle: 'Download',
            textContent: [
                "100% native Android application",
                "Full performance of MT4 account functions",
                "3 types of charts",
                "30 technical indicators",
                //  "A complete historical record of trading activity",

            ],
            url: 'https://download.mql5.com/cdn/mobile/mt4/android?utm_source=www.metatrader4.com&utm_campaign=install.metaquotes'
        },
        {
            id: 3,
            img: 'assets/images/platforms/android.png',
            title: "Android tablet",
            disabled: false,
            btnTitle: 'Download',
            textContent: ["100% native Android application",
                "Full performance of MT4 account functions",
                "3 types of charts",
                "30 technical indicators",],
            url: 'https://download.mql5.com/cdn/mobile/mt4/android?utm_source=www.metatrader4.com&utm_campaign=install.metaquotes'
        },
        {
            id: 3,
            img: 'assets/images/platforms/apple.png',
            title: "iPad",
            disabled: false,
            btnTitle: 'Download',
            textContent: ["100% genuine iPad app",
            "Full performance of MT4 account functions",
            "3 types of charts",
            "30 technical indicators",],
            url: 'https://download.mql5.com/cdn/mobile/mt4/ios?hl=en&utm_source=www.metatrader4.com&utm_campaign=install.metaquotes'
        },
        // {
        //     id: 3,
        //     img: 'assets/images/platforms/web.png',
        //     title: "Web Trader",
        //     btnTitle:'Go',
        //     textContent: "some text to explaint applications job and its benefits",
        //     url:'#'
        // },
    ]
    MT5Data = [
        {
            id: 1,
            img: 'assets/images/platforms/windows.png',
            title: "Windows",
            disabled: false,
            btnTitle: 'Download',
            textContent: [
                "One login to 5 platforms",
                "Spreads as low as 0.9 pips",
                "Full performance trading software",
                "Supports all types of commands",
                "80 formats for technical analysis",
                "Hedging is allowed",
            ],
            url: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.exe?utm_source=www.metatrader4.com&utm_campaign=download'
        },
        {
            id: 2,
            img: 'assets/images/platforms/macOS.png',
            title: "iPad",
            disabled: false,
            btnTitle: 'Download',
            textContent: [
                "100% genuine iPad app",
                "Fully functional MT5 account",
                "Supports all types of trading orders",
                "Built-in market analysis tools",
            ],
            url: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg?utm_source=www.metatrader4.com&utm_campaign=download.mt5.macos'
        },
        {
            id: 3,
            img: 'assets/images/platforms/android.png',
            title: "Android",
            disabled: false,
            btnTitle: 'Download',
            textContent: [
                "100% native Android application",
                "Full performance of MT5 account functions",
                "3 types of charts",
                "30 technical indicators",
                "A complete historical record of trading activity",

            ],
            url: 'https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5&hl=tr&gl=US'
        },
        {
            id: 3,
            img: 'assets/images/platforms/android.png',
            title: "Android tablet",
            disabled: false,
            btnTitle: 'Download',
            textContent: [
                "100% native Android application",
                "Fully functional MT5 account",
                "Supports all types of trading orders",
                "Built-in market analysis tools",
            ],
            url: 'https://download.mql5.com/cdn/mobile/mt4/android?utm_source=www.metatrader4.com&utm_campaign=install.metaquotes'
        },
        {
            id: 3,
            img: 'assets/images/platforms/apple.png',
            disabled: false,
            title: "iPhone",
            btnTitle: 'Download',
            textContent: [
                "100% genuine iPhone app",
                "Fully functional MT5 account",
                "Supports all types of trading orders",
                "Built-in market analysis tools",
            ],
            url: 'https://apps.apple.com/tr/app/metatrader-5/id413251709?l=tr'
        },
        // {
        //     id: 3,
        //     img: 'assets/images/platforms/web.png',
        //     title: "Web Trader",
        //     btnTitle: 'Go',
        //     disabled: true,
        //     textContent: "some text to explaint applications job and its benefits",
        //     url: `${this.apiUrl}/platforms/enter-webtrader`
        // },
    ]
    tradeAppData = [
        // {
        //     id: 1,
        //     img: 'assets/images/platforms/android.png',
        //     title: "ANDROID",
        //     btnTitle:'Download',
        //     textContent: "some text to explaint applications job and its benefits",
        //     url:'#'
        // },
        // {
        //     id: 2,
        //     img: 'assets/images/platforms/apple.png',
        //     title: "IOS",
        //     btnTitle:'Download',
        //     textContent: "some text to explaint applications job and its benefits",
        //     url:'#'
        // },
        {
            id: 3,
            img: 'assets/images/platforms/web.png',
            title: "Web Trader",
            btnTitle: 'Go',
            disabled: true,
            textContent: "some text to explaint applications job and its benefits",
            url: '#'
        },]

    ngOnInit(): void {
        /**
        * BreadCrumb
        */
        this.breadCrumbItems = [
            { label: 'PLATFORMS' },
            { label: 'APPDOWNLOAD', active: true }
        ];
    }
}