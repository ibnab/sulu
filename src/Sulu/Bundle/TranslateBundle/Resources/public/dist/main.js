require.config({paths:{sulutranslate:"../../sulutranslate/dist"}}),define({name:"Sulu Translate Bundle",initialize:function(a){"use strict";var b=a.sandbox;a.components.addSource("sulutranslate","/bundles/sulutranslate/dist/components"),b.mvc.routes.push({route:"settings/translate",callback:function(){this.html('<div data-aura-component="packages@sulutranslate" data-aura-display="list" data-aura-display="settings"/>')}}),b.mvc.routes.push({route:"settings/translate/add",callback:function(){this.html('<div data-aura-component="packages/components/content@sulutranslate" data-aura-display="settings" data-aura-startComponent="packages@sulutranslate" />')}}),b.mvc.routes.push({route:"settings/translate/edit::id/:content",callback:function(a,b){this.html('<div data-aura-component="packages/components/content@sulutranslate" data-aura-display="'+b+'" data-aura-id="'+a+'"/>')}}),b.mvc.routes.push({route:"settings/translate/edit::id/details::catalogueId",callback:function(a,b){this.html('<div data-aura-component="packages/components/content@sulutranslate" data-aura-display="details" data-aura-id="'+a+'" data-aura-catalogue="'+b+'"/>')}})}});