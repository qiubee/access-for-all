# Bronnen voor opd. 1

Diverse bronnen over wat Progressive Enhancement is en hoe het werkt.

## Building a resilient frontend using progressive enhancement

Progressive enhancement is een manier om websites te bouwen gebaseerd op het idee dat je start met alleen HTML, voordat je begint met het toeveogen van CSS en JavaScript.

Met progressive enhancement betekent dat gebruikers kunnen doen wat ze moeten doen ook als een deel van de technieken faalt. Het gebruiken van progressive enhancement betekent:

* Een dienst die robuuster is
* Een dienst waarbij de basis functionaliteit werkt en waarbij de basisbehoefte van de gebruiker wordt vervuld
* Een verbeterde toegankelijkheid door het schrijven van goed semantische opmaak
* Een betere verbinding en gebruik van de dienst met diverse apparaten

## Stappen voor progressive enhancement

* Begin met HTML. Websites moeten functioneel zijn met alleen HTML.
* Gebruik bij interactieve elementen een fallback dat voorziet in dezelfde basis van de functionaliteit. Laat de gebruiker doen wat ze wil doen ook als een interactief element het niet doet.
* Maak een goede structuur van de orde van welke bron wordt geladen en een logische uitlijning van de content.

Nadat je een goede basis hebt met HTML kun je dingen toevoegen als:

* afbeeldingen
* styling
* video en audio
* JavaScript
* interacties
* validatie
* interactieve datavisualisaties

Voor meer complexe diensten moet je het opdelen in verschillende interacties en bepalen of JavaScript de beste ervaring biedt. Probeer eerst de functionaliteit te maken zonder JavaScript. Als dat niet mogelijk is moet de JavaScript implementatie een fallback hebben.

Als je een JavaScript framework gebruikt moet het laden in geisoleerde componenten. Als het niet lukt om JavaScript te laden, is het maar een component dat niet werkt. Als je de hele pagina rendert met een JavaScript framework, en het is niet gelukt om te laden, zal het kapot gaan. De componenten moeten fallbacks hebben, zodat gebruikers het kunnen gebruiken als JavaScript niet werkt.

[Building a resilient frontend using progressive enhancement - gov.uk](https://www.gov.uk/service-manual/technology/using-progressive-enhancement)


## A quick introduction to progressive enhancement

Progressive enhancement focuses on the experiences of these users across different devices and ensures that they can get the value they desire from your website regardless of the device they use. Progressive enhancement as a concept involves building an application at a base level of user experience and then adding functional enhancements when a browser supports it.

In web development, the layers include your HTML, CSS, and JavaScript. The first layer is clean and semantic HTML that works on any browser or device; it works everywhere. Having your content structured properly means it can still be of value even when CSS and JavaScript are not available. With CSS, we improve the visual design of our content and go on to provide more meaning to it. CSS is progressively enhanced by default, so when a browser comes across a property it doesn’t recognize, it ignores it. JavaScript is the least reliable of all these layers. With JavaScript, you can go on to provide enhanced functionality for browsers that support it. The recommended approach here is feature detection instead of browser detection; this means you check if a browser has this feature available instead of trying to detect which browser it is.

### Benefits with using Progressive Enhancement 

Progressive enhancement prioritizes your content, ensuring users can begin to use your website as fast as possible. Progressive enhancements involve using semantic HTML to mark up your content right from the start.

### Progressive Enhancement Techniques

* Avoid inline styling
	
	To ensure clean and semantic HTML, we also have to separate styles from markup.

* Unobtrusive JavaScript.

	Ensuring that any behavior or functionality dependent on JavaScript is completely separated from the actual content or presentation.

* Preloading fonts.

	Set a system font as default that should be used as the fallback to render the content and then changed to a web font when it is done loading.

* Responsiveness and media queries.

	Follow the mobile-first approach, in which you start by building the mobile layout and then work your way up to bigger screens. With CSS media queries, you can present the same content in different layouts.

* Lazy loading images progressively.

	With lazy loading, images don’t load until they come into the browser’s viewport. This is great for performance but usually involves using a JavaScript library to dynamically load these images. To lazy load with progressive enhancement in mind, you could include a fallback `<img> `element within a `<noscript> `tag that the browser can rely on.

* Feature detection.

	By checking if a feature exists, we are able to tailor an enhanced experience for those with newer browsers that supports the features needed.

### Summary

Progressive enhancement is not a new concept. It’s an important practice that helps us build websites and applications that can be used on as many devices as possible while still being able to scale, change, and implement new features as they become available.

[A quick introduction to progressive enhancement - LogRocket](https://blog.logrocket.com/a-quick-introduction-to-progressive-enhancement/)

## Progressive Enhancement - MDN

Progressive enhancement is een design filosofie that een basis geeft van essentiale informatie en functionaliteit aan zo veel mogelijk gebruikers en de best mogelijke ervaring biedt aan de gebuikers met de meest moderne browser die de nieuwste functionaliteit bieden.

**Feature detection** is een optie dat aangeeft of een browser een bepaalde functionaliteit ondersteund. **Polyfills** is het toevoegen van een functionaliteit die mist in JavaScript.

[Progressive Enhancement - MDN](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)

## Graceful degradation versus progressive enhancement

So, **graceful degradation** is the practice of building your web functionality so that it provides a certain level of user experience in more modern browsers, but it will also degrade gracefully to a lower level of user in experience in older browsers. This lower level is not as nice to use for your site visitors, but it does still provide them with the basic functionality that they came to your site to use; things do not break for them.

**Progressive enhancement** is similar, but it does things the other way round. You start by establishing a basic level of user experience that all browsers will be able to provide when rendering your web site, but you also build in more advanced functionality that will automatically be available to browsers that can use it.

In other words, graceful degradation starts from the status quo of complexity and tries to fix for the lesser experience whereas progressive enhancement starts from a very basic, working example and allows for constant extension for future environments. Degrading gracefully means looking back whereas enhancing progressively means looking forward whilst keeping your feet on firm ground. 

[Graceful degradation versus progressive enhancement - W3](https://www.w3.org/wiki/Graceful_degradation_versus_progressive_enhancement)