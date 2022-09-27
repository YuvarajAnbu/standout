"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[399],{399:function(e,n,i){i.r(n),i.d(n,{default:function(){return x}});var s=i(1413),t=i(885),c=i(2791),r=i(8567),l=i(1523),a=i(1363),_=i(4542),o=i(184);var d=function(e){var n=e.hidden,i=e.setHidden,r=e.billingDetails,l=e.setBillingDetails,d=(0,_.cI)(),u=d.register,h=d.handleSubmit,m=d.errors,p=(0,c.useState)(!1),g=(0,t.Z)(p,2),f=g[0],b=g[1];return(0,o.jsxs)("div",{className:"billing__checkout__content__container",children:[(0,o.jsxs)("form",{onSubmit:h((function(e){l((function(n){return(0,s.Z)((0,s.Z)({},n),{},{user:e})})),i(f?function(e){return(0,s.Z)((0,s.Z)({},e),{},{user:!0})}:function(e){return(0,s.Z)((0,s.Z)({},e),{},{user:!0,address:!1})})})),className:n.user?"billing__checkout__content__container__form billing__checkout__content__container__form--hidden":"billing__checkout__content__container__form",children:[(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__flex",children:[(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"firstName",children:["first name ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"firstName",ref:u({pattern:{value:/^\w{2,}$/,message:"Should be 2 or more than 2 letters"},required:"Required"}),defaultValue:r.user.firstName}),"undefined"!==typeof m.firstName&&(0,o.jsxs)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",m.firstName.message]})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"lastName",children:["last name ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"lastName",ref:u({pattern:{value:/^\w{2,}$/,message:"Should be 2 or more than 2 letters"},required:"Required"}),defaultValue:r.user.lastName}),"undefined"!==typeof m.lastName&&(0,o.jsxs)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",m.lastName.message]})]})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"email",children:["email address ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"email",type:"text",ref:u({pattern:{value:/^\w{2,}@\w{2,}\.\w{2,}(\.\w{2,})?$/,message:"Invalid Email Address"},required:"Required"}),defaultValue:r.user.email}),"undefined"!==typeof m.email&&(0,o.jsxs)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",m.email.message]})]}),(0,o.jsx)("button",{type:"submit",children:"continue"})]}),"undefined"!==typeof r.user&&(0,o.jsxs)("div",{className:n.user?"billing__checkout__content__container__desc":"billing__checkout__content__container__desc billing__checkout__content__container__desc--hidden",children:[(0,o.jsx)("p",{children:"".concat(r.user.firstName," ").concat(r.user.lastName)}),(0,o.jsx)("p",{children:r.user.email}),(0,o.jsx)("p",{className:"billing__checkout__content__container__desc__edit",onClick:function(){b(!0),i((function(e){return(0,s.Z)((0,s.Z)({},e),{},{user:!1})}))},children:"edit"})]})]})};var u=function(e){var n=e.usStates,i=e.setHidden,t=e.addresses,c=e.billingDetails,r=e.setBillingDetails,l=e.errors,_=e.register,d=e.hideBillingAddress,u=e.showShippingForm,h=e.setShowShippingForm;return(0,o.jsxs)("div",{children:[(0,o.jsxs)("p",{className:"billing__checkout__content__container__form__label",children:["shipping address",t.length>=1&&u&&(0,o.jsx)("span",{onClick:function(){h(!1),r((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:{shipping:{},billing:e.address.billing}})}))},children:"choose address"})]}),"undefined"!==typeof l.addressShipping&&(0,o.jsxs)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.addressShipping.message]}),u?(0,o.jsxs)("div",{children:[(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__flex",children:[(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"shipping.firstName",children:["first name ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"shipping.firstName",ref:_({pattern:{value:/^[\w ]{0,}[\w]{2,}[\w ]{0,}$/,message:"Should only be 2 or more than 2 letters"},required:"Required"}),defaultValue:c.address.shipping.firstName}),"undefined"!==typeof l.shipping&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.shipping.firstName&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.shipping.firstName.message]})})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"shipping.lastName",children:["last name ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"shipping.lastName",ref:_({pattern:{value:/^[\w ]{0,}[\w]{2,}[\w ]{0,}$/,message:"Should only be 2 or more than 2 letters"},required:"Required"}),defaultValue:c.address.shipping.lastName}),"undefined"!==typeof l.shipping&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.shipping.lastName&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.shipping.lastName.message]})})]})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"shipping.streetAddress",children:["street address ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"shipping.streetAddress",ref:_({pattern:{value:/^[\w ]{0,}[\w/d]{2,}[\w ]{0,}$/,message:"Should only be 2 or more than 2 numbers or letters"},required:"Required"}),defaultValue:c.address.shipping.streetAddress}),"undefined"!==typeof l.shipping&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.shipping.streetAddress&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.shipping.streetAddress.message]})})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsx)("label",{htmlFor:"shipping.extendedAddress",children:"Apt #, Floor, etc. (optional)"}),(0,o.jsx)("input",{name:"shipping.extendedAddress",ref:_({pattern:{value:/^[\w ]{0,}[\w/d]{2,}[\w ]{0,}$/,message:"Should only be 2 or more than 2 numbers or letters"}}),defaultValue:c.address.shipping.extendedAddress}),"undefined"!==typeof l.shipping&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.shipping.extendedAddress&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.shipping.extendedAddress.message]})})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__flex",children:[(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"shipping.postalCode",children:["postal code ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"shipping.postalCode",ref:_({pattern:{value:/^\d{5}([-]?\d{4})?$/,message:"Invalid Postal Code"},required:"Required"}),defaultValue:c.address.shipping.postalCode}),"undefined"!==typeof l.shipping&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.shipping.postalCode&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.shipping.postalCode.message]})})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"shipping.locality",children:["city ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"shipping.locality",ref:_({pattern:{value:/^[\w ]{0,}[\w]{2,}[\w ]{0,}$/,message:"Should only be 2 or more than 2 numbers or letters"},required:"Required"}),defaultValue:c.address.shipping.locality}),"undefined"!==typeof l.shipping&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.shipping.locality&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.shipping.locality.message]})})]})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"shipping.region",children:["State / Province ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container__select-container",children:[(0,o.jsx)("select",{name:"shipping.region",ref:_,defaultValue:c.address.shipping.region,children:n.map((function(e,n){return(0,o.jsx)("option",{value:e.abbreviation,children:e.name},n)}))}),(0,o.jsx)(a.G,{icon:"chevron-right",className:"icon"})]})]})]}):(0,o.jsxs)("div",{className:"billing__checkout__content__container__address-container",children:[t.map((function(e,n){return(0,o.jsxs)("div",{className:"billing__checkout__content__container__address-container__address",children:[(0,o.jsx)("input",{id:"radio-button",type:"radio",name:"addressShipping",value:n,ref:_({required:"Address cannot be empty"}),onClick:function(n){delete e._id,d?(r((function(n){return(0,s.Z)((0,s.Z)({},n),{},{address:{shipping:e,billing:e}})})),i((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:!0,card:!1})}))):(r((function(n){return(0,s.Z)((0,s.Z)({},n),{},{address:{shipping:e,billing:n.address.billing}})})),"undefined"!==typeof c.address.billing&&i((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:!0,card:!1})})))}}),(0,o.jsx)("div",{className:"billing__checkout__content__container__address-container__address__icon"}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__address-container__address__desc",children:[(0,o.jsx)("p",{children:"".concat(e.firstName," ").concat(e.lastName)}),""!==e.extendedAddress&&(0,o.jsxs)("p",{children:[e.extendedAddress,","]}),(0,o.jsxs)("p",{children:[e.streetAddress,","]}),(0,o.jsx)("p",{children:"".concat(e.locality,", ").concat(e.region," ").concat(e.postalCode)})]})]},n)})),(0,o.jsx)("div",{className:"billing__checkout__content__container__address-container__address billing__checkout__content__container__address-container__none",onClick:function(){h(!0),r((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:{shipping:{},billing:e.address.billing}})}))},children:(0,o.jsx)("p",{children:"none of these"})})]})]})};var h=function(e){var n=e.usStates,i=e.addresses,t=e.billingDetails,c=e.setBillingDetails,r=e.setHidden,l=e.errors,_=e.register,d=e.showBillingForm,u=e.setShowBillingForm;return(0,o.jsxs)("div",{className:"billing__checkout__content__container__form--billing",children:[(0,o.jsxs)("p",{className:"billing__checkout__content__container__form__label",children:["Billing address",i.length>=1&&d&&(0,o.jsx)("span",{onClick:function(){u(!1),c((function(e){return delete e.address.billing,(0,s.Z)({},e)}))},children:"choose address"})]}),"undefined"!==typeof l.addressBilling&&(0,o.jsxs)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.addressBilling.message]}),d?(0,o.jsxs)("div",{children:[(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__flex",children:[(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"billing.firstName",children:["first name ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"billing.firstName",ref:_({pattern:{value:/^[\w ]{0,}[\w]{2,}[\w ]{0,}$/,message:"Should only be 2 or more than 2 letters"},required:"Required"})}),"undefined"!==typeof l.billing&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.billing.firstName&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.billing.firstName.message]})})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"billing.lastName",children:["last name ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"billing.lastName",ref:_({pattern:{value:/^[\w ]{0,}[\w]{2,}[\w ]{0,}$/,message:"Should only be 2 or more than 2 letters"},required:"Required"})}),"undefined"!==typeof l.billing&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.billing.lastName&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.billing.lastName.message]})})]})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"billing.streetAddress",children:["street address ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"billing.streetAddress",ref:_({pattern:{value:/^[\w ]{0,}[\w/d]{2,}[\w ]{0,}$/,message:"Should only be 2 or more than 2 numbers or letters"},required:"Required"})}),"undefined"!==typeof l.billing&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.billing.streetAddress&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.billing.streetAddress.message]})})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsx)("label",{htmlFor:"billing.extendedAddress",children:"Apt #, Floor, etc. (optional)"}),(0,o.jsx)("input",{name:"billing.extendedAddress",ref:_({pattern:{value:/^[\w ]{0,}[\w/d]{2,}[\w ]{0,}$/,message:"Should only be 2 or more than 2 numbers or letters"}})}),"undefined"!==typeof l.billing&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.billing.extendedAddress&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.billing.extendedAddress.message]})})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__flex",children:[(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"billing.postalCode",children:["postal code ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"billing.postalCode",ref:_({pattern:{value:/^\d{5}([-]?\d{4})?$/,message:"Invalid Postal Code"},required:"Required"})}),"undefined"!==typeof l.billing&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.billing.postalCode&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.billing.postalCode.message]})})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"billing.locaity",children:["city ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("input",{name:"billing.locality",ref:_({pattern:{value:/^[\w ]{0,}[\w/d]{2,}[\w ]{0,}$/,message:"Should only be 2 or more than 2 numbers or letters"},required:"Required"})}),"undefined"!==typeof l.billing&&(0,o.jsx)("p",{className:"billing__checkout__content__container__form__input-container__error-msg",children:"undefined"!==typeof l.billing.locality&&(0,o.jsxs)("span",{children:[(0,o.jsx)(a.G,{icon:"circle",className:"icon"})," ",l.billing.locality.message]})})]})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"billing.region",children:["State / Province ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container__select-container",children:[(0,o.jsx)("select",{name:"billing.region",placeholder:"State / Province",ref:_,children:n.map((function(e,n){return(0,o.jsx)("option",{value:e.abbreviation,children:e.name},n)}))}),(0,o.jsx)(a.G,{icon:"chevron-right",className:"icon"})]})]})]}):(0,o.jsxs)("div",{className:"billing__checkout__content__container__address-container",children:[i.map((function(e,n){return(0,o.jsxs)("div",{className:"billing__checkout__content__container__address-container__address",children:[(0,o.jsx)("input",{id:"radio-button",type:"radio",name:"addressBilling",value:n,ref:_({required:"address cannot be empty"}),onClick:function(){delete e._id,c((function(n){return(0,s.Z)((0,s.Z)({},n),{},{address:{shipping:n.address.shipping,billing:e}})})),"undefined"!==typeof t.address.shipping.firstName&&r((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:!0,card:!1})}))}}),(0,o.jsx)("div",{className:"billing__checkout__content__container__address-container__address__icon"}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__address-container__address__desc",children:[(0,o.jsx)("p",{className:"billing__checkout__content__container__address-container__address__desc__name",children:"".concat(e.firstName," ").concat(e.lastName)}),""!==e.extendedAddress&&(0,o.jsxs)("p",{children:[e.extendedAddress,","]}),(0,o.jsxs)("p",{children:[e.streetAddress,","]}),(0,o.jsx)("p",{children:"".concat(e.locality,", ").concat(e.region," ").concat(e.postalCode)})]})]},n)})),(0,o.jsx)("div",{className:"billing__checkout__content__container__address-container__none",onClick:function(){u(!0),c((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:{shipping:e.address.shipping}})}))},children:(0,o.jsx)("p",{children:"none of these"})})]})]})};var m=function(e){var n=e.hidden,i=e.setHidden,l=e.billingDetails,d=e.setBillingDetails,m=e.user,p=(0,c.useContext)(r.StateContext),g=(0,c.useState)([]),f=(0,t.Z)(g,2),b=f[0],x=f[1],j=(0,c.useState)(!0),N=(0,t.Z)(j,2),v=N[0],k=N[1],y=(0,c.useState)(!0),Z=(0,t.Z)(y,2),w=Z[0],S=Z[1],C=(0,c.useState)(!0),A=(0,t.Z)(C,2),F=A[0],q=A[1],D=(0,c.useState)(!1),O=(0,t.Z)(D,2),E=O[0],G=O[1];(0,c.useEffect)((function(){"undefined"!==typeof m.name&&(x(m.addresses),i((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:!1})})),m.addresses.length>0&&(S(!1),q(!1)))}),[i,m.name,m.addresses]),(0,c.useEffect)((function(){w||v&&"undefined"!==typeof l.address.shipping.firstName&&(d((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:{shipping:e.address.shipping,billing:e.address.shipping}})})),i((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:!0,card:!1})})))}),[v,l.address.shipping.firstName,d,i,w]);var B=(0,_.cI)(),$=B.register,P=B.handleSubmit,R=B.errors,H=B.setValue;return(0,o.jsxs)("div",{className:"billing__checkout__content__container",children:[(0,o.jsxs)("form",{onSubmit:P((function(e){"undefined"===typeof e.billing&&(e.billing=e.shipping),w||(delete e.addressShipping,e.shipping=l.address.shipping),F||(delete e.addressBilling,e.billing=l.address.billing);var n={};Object.keys(e).forEach((function(i){n[i]={},Object.keys(e[i]).forEach((function(s){"string"===typeof e[i][s]?(n[i][s]=e[i][s].trim(),H("".concat(i,".").concat(s),e[i][s].trim())):(n[i][s]=e[i][s],H("".concat(i,".").concat(s),e[i][s]))}))})),d((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:n})})),i(E?function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:!0})}:function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:!0,card:!1})})})),className:n.address?"billing__checkout__content__container__form--hidden":"billing__checkout__content__container__form",children:[(0,o.jsx)(u,{addresses:b,billingDetails:l,setBillingDetails:d,setHidden:i,errors:R,register:$,hideBillingAddress:v,setHideBillingAddress:k,showShippingForm:w,setShowShippingForm:S,usStates:p}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__checkbox",children:[(0,o.jsx)("div",{className:"billing__checkout__content__container__form__checkbox__icons",onClick:function(){k((function(e){return!e})),d((function(e){return delete e.address.billing,(0,s.Z)({},e)}))},children:v?(0,o.jsx)(a.G,{icon:"check-square"}):(0,o.jsx)(a.G,{icon:["far","square"]})}),(0,o.jsx)("p",{children:"Billing Address is same as the Shipping Address"})]}),!v&&(0,o.jsx)(h,{addresses:b,billingDetails:l,setBillingDetails:d,setHidden:i,errors:R,register:$,showBillingForm:F,setShowBillingForm:q,usStates:p}),(w||F)&&(0,o.jsx)("button",{type:"submit",children:"continue"})]}),"undefined"!==typeof l.address.shipping&&"undefined"!==typeof l.address.billing&&(0,o.jsxs)("div",{className:n.address?"billing__checkout__content__container__desc billing__checkout__content__container__desc--address":"billing__checkout__content__container__desc billing__checkout__content__container__desc--hidden billing__checkout__content__container__desc billing__checkout__content__container__desc--address",children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("p",{className:"billing__checkout__content__container__desc__label",children:"shipping address"}),(0,o.jsx)("p",{children:"".concat(l.address.shipping.firstName," ").concat(l.address.shipping.lastName)}),(0,o.jsx)("p",{children:l.address.shipping.streetAddress}),""!==l.address.shipping.extendedAddress&&(0,o.jsx)("p",{children:l.address.shipping.extendedAddress}),(0,o.jsx)("p",{children:"".concat(l.address.shipping.locality,", ").concat(l.address.shipping.region,", ").concat(l.address.shipping.postalCode)})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("p",{className:"billing__checkout__content__container__desc__label",children:"billing address"}),(0,o.jsx)("p",{children:"".concat(l.address.billing.firstName," ").concat(l.address.billing.lastName)}),(0,o.jsx)("p",{children:l.address.billing.streetAddress}),""!==l.address.billing.extendedAddress&&(0,o.jsx)("p",{children:l.address.billing.extendedAddress}),(0,o.jsx)("p",{children:"".concat(l.address.billing.locality,", ").concat(l.address.billing.region,", ").concat(l.address.billing.postalCode)})]}),(0,o.jsx)("p",{className:"billing__checkout__content__container__desc__edit",onClick:function(){(G(!0),i((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:!1})})),b.length>=1)&&document.querySelectorAll("#radio-button").forEach((function(e){e.checked=!1}));w||d((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:{shipping:{},billing:e.address.billing}})})),F||d((function(e){return(0,s.Z)((0,s.Z)({},e),{},{address:{shipping:e.address.shipping}})}))},children:"edit"})]})]})},p=i(2982),g=i(4569),f=i.n(g);var b=function(e){var n=e.cart,i=e.billingDetails,s=e.setPaymentSuccess,l=e.setPaymentFailed,a=e.setOrderId,_=e.subTotal,d=(0,c.useContext)(r.OrdersContext),u=d.orders,h=d.setOrders,m=(0,c.useState)(!1),g=(0,t.Z)(m,2),b=g[0],x=g[1],j=(0,c.useState)(!0),N=(0,t.Z)(j,2),v=N[0],k=N[1],y=(0,c.useState)(!1),Z=(0,t.Z)(y,2),w=Z[0],S=Z[1];return(0,c.useEffect)((function(){if(!b){var e=["https://js.braintreegateway.com/web/3.65.0/js/client.min.js","https://js.braintreegateway.com/web/3.65.0/js/hosted-fields.min.js"];e.forEach((function(n,i){var s=document.createElement("script");s.src=n,document.body.appendChild(s),e.length-1===i&&(s.onload=function(){x(!0)})}))}}),[b]),(0,c.useEffect)((function(){b&&f().get("/payment/client_token").then((function(e){if(200===e.status){var t=document.querySelector("#hosted-fields-form"),c=document.querySelector("#payment-card-btn");window.braintree.client.create({authorization:e.data},(function(e,r){e?console.error(e):window.braintree.hostedFields.create({client:r,styles:{input:{"font-size":"13px"}},fields:{number:{selector:"#card-number",placeholder:"4111 1111 1111 1111",prefill:"4111 1111 1111 1111"},cvv:{selector:"#cvv",placeholder:"123",prefill:"123"},expirationDate:{selector:"#expiration-date",placeholder:"10/30",prefill:"10/30"}}},(function(e,r){e?console.error(e):(c.removeAttribute("disabled"),k(!1),t.addEventListener("submit",(function(e){e.preventDefault(),S(!0),r.tokenize((function(e,t){if(e)return console.error(e),void S(!1);var c={payload:t,cart:n,billingDetails:i};f().post("/payment/checkout",c).then((function(e){return e.data})).then((function(e){r.teardown((function(e){e?console.error("Could not tear down the Hosted Fields form!"):console.info("Hosted Fields form has been torn down!")})),S(!1),s(!0),h((function(e){return[].concat((0,p.Z)(e),[{_id:e.length,items:n,delivered:!1,customer:i.user,amount:(Number(_()/100)+Number(2*_()/1e4)).toFixed(2),shippingAddress:i.address.shipping,billingAddress:i.address.billing,date:(new Date).toISOString()}])})),a(u.length+1)})).catch((function(e){S(!1),l(!0)}))}))}),!1))}))}))}})).catch((function(e){console.log(e)}))}),[b,i,n,a,l,s,_,h,u]),b?(0,o.jsxs)("div",{className:"billing__checkout__content__container__form",children:[v&&(0,o.jsx)("div",{className:"loader-container",children:(0,o.jsx)("div",{className:"loader"})}),(0,o.jsxs)("form",{action:"/payment/checkout",method:"post",className:v?"billing__checkout__content__container__form__card billing__checkout__content__container__form__card--hidden":"billing__checkout__content__container__form__card",id:"hosted-fields-form",children:[(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"card-number",children:["card number ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("div",{id:"card-number",className:"hosted-field"})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__flex billing__checkout__content__container__form__flex--card",children:[(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"cvv",children:["cvv ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("div",{id:"cvv",className:"hosted-field"})]}),(0,o.jsxs)("div",{className:"billing__checkout__content__container__form__input-container",children:[(0,o.jsxs)("label",{htmlFor:"expiration-date",children:["Expiration date ",(0,o.jsx)("span",{children:"*"})]}),(0,o.jsx)("div",{id:"expiration-date",className:"hosted-field"})]})]}),w?(0,o.jsx)("button",{type:"button",className:"payment-card-btn payment-card-btn--loading",disabled:!0,children:(0,o.jsx)("div",{className:"payment-card-btn__loading"})}):(0,o.jsx)("button",{type:"submit",disabled:!0,id:"payment-card-btn",children:"place order"})]})]}):(0,o.jsx)("div",{className:"loader-container",children:(0,o.jsx)("div",{className:"loader"})})};var x=function(){var e=(0,c.useContext)(r.CartContext),n=e.cart,i=e.setCart,a=(0,c.useContext)(r.UserContext).user,_=(0,c.useContext)(r.ColorsContext),u=(0,c.useState)({user:{},address:{shipping:{}}}),h=(0,t.Z)(u,2),p=h[0],g=h[1],f=(0,c.useState)({user:!1,address:!0,card:!0}),x=(0,t.Z)(f,2),j=x[0],N=x[1],v=(0,c.useState)(!1),k=(0,t.Z)(v,2),y=k[0],Z=k[1],w=(0,c.useState)(!1),S=(0,t.Z)(w,2),C=S[0],A=S[1],F=(0,c.useState)(""),q=(0,t.Z)(F,2),D=q[0],O=q[1];(0,c.useEffect)((function(){document.title="Checkout | Stand Out"}),[]),(0,c.useEffect)((function(){if("undefined"!==typeof a.name){N((function(e){return(0,s.Z)((0,s.Z)({},e),{},{user:!0})}));var e=a.name.split(" "),n=(0,t.Z)(e,2),i=n[0],c=n[1];g((function(e){return(0,s.Z)((0,s.Z)({},e),{},{user:{firstName:i,lastName:c,email:a.email}})}))}}),[a]);var E=function(){var e=0;return n.forEach((function(n){e+=Number(n.price*n.quantity)})),e};return n.length<1?(0,o.jsxs)("div",{className:"billing__tool-tip-container",children:[(0,o.jsxs)("div",{className:"billing__tool-tip-container__tool-tip",children:[(0,o.jsx)("p",{children:"No items in your cart. Go back to home page and add some items to purchase."}),(0,o.jsx)(l.rU,{to:"/",children:(0,o.jsx)("button",{children:"ok"})})]}),(0,o.jsx)(l.rU,{to:"/",children:(0,o.jsx)("div",{className:"billing__tool-tip-container__black-box"})})]}):(0,o.jsxs)("div",{className:"billing",children:[y&&(0,o.jsxs)("div",{className:"billing__tool-tip-container",children:[(0,o.jsxs)("div",{className:"billing__tool-tip-container__tool-tip",children:[(0,o.jsx)("p",{children:"undefined"!==typeof a.name?"purchase successfull go to orders to see it.":"purchase successful. Your orderId is ".concat(D)}),(0,o.jsx)(l.rU,{to:"undefined"!==typeof a.name?"/your-orders":"/",children:(0,o.jsx)("button",{onClick:function(){i([])},children:"ok"})})]}),(0,o.jsx)(l.rU,{to:"undefined"!==typeof a.name?"/your-orders":"/",children:(0,o.jsx)("div",{className:"billing__tool-tip-container__black-box",onClick:function(){i([])}})})]}),C&&(0,o.jsxs)("div",{className:"billing__tool-tip-container",children:[(0,o.jsxs)("div",{className:"billing__tool-tip-container__tool-tip",children:[(0,o.jsx)("p",{children:"payment failed please try again."}),(0,o.jsx)("button",{onClick:function(){A(!1)},children:"ok"})]}),(0,o.jsx)("div",{className:"billing__tool-tip-container__black-box",onClick:function(){A(!1)}})]}),(0,o.jsxs)("div",{className:"billing__checkout",children:[(0,o.jsx)("h2",{className:"billing__checkout__label",children:"checkout"}),(0,o.jsxs)("div",{className:"billing__checkout__content",children:[(0,o.jsx)("p",{className:j.user?"billing__checkout__content__label billing__checkout__content__label--active":"billing__checkout__content__label",children:"1. contact information"}),(0,o.jsx)(d,{hidden:j,setHidden:N,billingDetails:p,setBillingDetails:g})]}),(0,o.jsxs)("div",{className:"billing__checkout__content",children:[(0,o.jsx)("p",{className:j.address?"billing__checkout__content__label billing__checkout__content__label--active":"billing__checkout__content__label",children:"2. shipping & billing address"}),(0,o.jsx)(m,{hidden:j,setHidden:N,billingDetails:p,setBillingDetails:g,user:a})]}),(0,o.jsxs)("div",{className:"billing__checkout__content",children:[(0,o.jsx)("p",{className:j.card?"billing__checkout__content__label billing__checkout__content__label--active":"billing__checkout__content__label",children:"3. payment"}),!j.card&&(0,o.jsx)(b,{cart:n,billingDetails:p,user:a,setPaymentSuccess:Z,setPaymentFailed:A,setOrderId:O,setCart:i,subTotal:E})]})]}),(0,o.jsxs)("div",{className:"billing__cart",children:[(0,o.jsxs)("div",{className:"billing__cart__summary",children:[(0,o.jsx)("p",{className:"billing__cart__summary__label",children:"cart summary"}),(0,o.jsxs)("div",{className:"billing__cart__summary__desc",children:[(0,o.jsx)("p",{children:"Merchandise Subtotal"}),(0,o.jsx)("p",{children:"$ ".concat((E()/100).toFixed(2))})]}),(0,o.jsxs)("div",{className:"billing__cart__summary__desc",children:[(0,o.jsx)("p",{children:"Shipping Charges"}),(0,o.jsx)("p",{children:"FREE"})]}),(0,o.jsxs)("div",{className:"billing__cart__summary__desc",children:[(0,o.jsx)("p",{children:"Estimated Tax"}),(0,o.jsx)("p",{children:"$ ".concat((2*E()/1e4).toFixed(2))})]}),(0,o.jsxs)("div",{className:"billing__cart__summary__total",children:[(0,o.jsx)("p",{children:"Estimated Total (usd) :"}),(0,o.jsx)("p",{children:"$".concat((Number(E()/100)+Number(2*E()/1e4)).toFixed(2))})]})]}),(0,o.jsxs)("div",{className:"billing__cart__items",children:[(0,o.jsxs)("h3",{className:"billing__cart__items__label",children:["cart ",(0,o.jsxs)("span",{children:["(",function(){var e=0;return n.forEach((function(n){e+=n.quantity})),e}()," Items)"]})]}),n.map((function(e,n){return(0,o.jsx)("div",{className:"billing__cart__items__item",children:(0,o.jsxs)("div",{className:"billing__cart__items__item__content",children:[(0,o.jsx)("div",{className:"billing__cart__items__item__content__img",children:(0,o.jsx)(l.rU,{to:"/item/".concat(e._id),children:(0,o.jsx)("img",{src:e.image,alt:e.name,onError:function(e){e.target.src="/images/imgFailed.jpg"}})})}),(0,o.jsxs)("div",{className:"billing__cart__items__item__content__desc",children:[(0,o.jsx)(l.rU,{to:"/item/".concat(e._id),children:(0,o.jsx)("p",{className:"billing__cart__items__item__content__desc__name",children:e.name})}),(0,o.jsx)("p",{children:"$ ".concat((e.price*e.quantity/100).toFixed(2))}),(0,o.jsxs)("p",{children:["color: ",_.filter((function(n){return n[1]===e.color}))[0][0]]}),(0,o.jsxs)("p",{children:["size: ",e.size]}),(0,o.jsx)("p",{children:"Qty: ".concat(e.quantity)})]})]})},n)}))]})]})]})}},1413:function(e,n,i){i.d(n,{Z:function(){return c}});var s=i(4942);function t(e,n){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);n&&(s=s.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),i.push.apply(i,s)}return i}function c(e){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?t(Object(i),!0).forEach((function(n){(0,s.Z)(e,n,i[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):t(Object(i)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(i,n))}))}return e}}}]);
//# sourceMappingURL=399.f1c63818.chunk.js.map