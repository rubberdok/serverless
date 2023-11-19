import type { DocumentNode } from 'graphql';
  export const typeDefs = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query","loc":{"start":5,"end":10}},"interfaces":[],"directives":[],"fields":[],"loc":{"start":0,"end":10}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation","loc":{"start":17,"end":25}},"interfaces":[],"directives":[],"fields":[],"loc":{"start":12,"end":25}},{"kind":"ScalarTypeDefinition","name":{"kind":"Name","value":"DateTime","loc":{"start":34,"end":42}},"directives":[],"loc":{"start":27,"end":42}},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"NewBookingInput","loc":{"start":49,"end":64}},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"cabinId","loc":{"start":69,"end":76}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":78,"end":80}},"loc":{"start":78,"end":80}},"loc":{"start":78,"end":81}},"directives":[],"loc":{"start":69,"end":81}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"startDate","loc":{"start":84,"end":93}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime","loc":{"start":95,"end":103}},"loc":{"start":95,"end":103}},"loc":{"start":95,"end":104}},"directives":[],"loc":{"start":84,"end":104}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"endDate","loc":{"start":107,"end":114}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime","loc":{"start":116,"end":124}},"loc":{"start":116,"end":124}},"loc":{"start":116,"end":125}},"directives":[],"loc":{"start":107,"end":125}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"firstName","loc":{"start":128,"end":137}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":139,"end":145}},"loc":{"start":139,"end":145}},"loc":{"start":139,"end":146}},"directives":[],"loc":{"start":128,"end":146}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"lastName","loc":{"start":149,"end":157}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":159,"end":165}},"loc":{"start":159,"end":165}},"loc":{"start":159,"end":166}},"directives":[],"loc":{"start":149,"end":166}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email","loc":{"start":169,"end":174}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":176,"end":182}},"loc":{"start":176,"end":182}},"loc":{"start":176,"end":183}},"directives":[],"loc":{"start":169,"end":183}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"phoneNumber","loc":{"start":186,"end":197}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":199,"end":205}},"loc":{"start":199,"end":205}},"loc":{"start":199,"end":206}},"directives":[],"loc":{"start":186,"end":206}}],"loc":{"start":43,"end":208}},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"UpdateBookingStatusInput","loc":{"start":216,"end":240}},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id","loc":{"start":245,"end":247}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":249,"end":251}},"loc":{"start":249,"end":251}},"loc":{"start":249,"end":252}},"directives":[],"loc":{"start":245,"end":252}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"status","loc":{"start":255,"end":261}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Status","loc":{"start":263,"end":269}},"loc":{"start":263,"end":269}},"loc":{"start":263,"end":270}},"directives":[],"loc":{"start":255,"end":270}}],"loc":{"start":210,"end":272}},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"Status","loc":{"start":279,"end":285}},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"PENDING","loc":{"start":290,"end":297}},"directives":[],"loc":{"start":290,"end":297}},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"CONFIRMED","loc":{"start":300,"end":309}},"directives":[],"loc":{"start":300,"end":309}},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"CANCELLED","loc":{"start":312,"end":321}},"directives":[],"loc":{"start":312,"end":321}},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"REJECTED","loc":{"start":324,"end":332}},"directives":[],"loc":{"start":324,"end":332}}],"loc":{"start":274,"end":334}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation","loc":{"start":341,"end":349}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"newBooking","loc":{"start":354,"end":364}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"data","loc":{"start":365,"end":369}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewBookingInput","loc":{"start":371,"end":386}},"loc":{"start":371,"end":386}},"loc":{"start":371,"end":387}},"directives":[],"loc":{"start":365,"end":387}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Booking","loc":{"start":390,"end":397}},"loc":{"start":390,"end":397}},"loc":{"start":390,"end":398}},"directives":[],"loc":{"start":354,"end":398}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateBookingStatus","loc":{"start":401,"end":420}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"data","loc":{"start":421,"end":425}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingStatusInput","loc":{"start":427,"end":451}},"loc":{"start":427,"end":451}},"loc":{"start":427,"end":452}},"directives":[],"loc":{"start":421,"end":452}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Booking","loc":{"start":455,"end":462}},"loc":{"start":455,"end":462}},"loc":{"start":455,"end":463}},"directives":[],"loc":{"start":401,"end":463}}],"loc":{"start":336,"end":465}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Cabin","loc":{"start":472,"end":477}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id","loc":{"start":482,"end":484}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":486,"end":488}},"loc":{"start":486,"end":488}},"loc":{"start":486,"end":489}},"directives":[],"loc":{"start":482,"end":489}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name","loc":{"start":492,"end":496}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":498,"end":504}},"loc":{"start":498,"end":504}},"loc":{"start":498,"end":505}},"directives":[],"loc":{"start":492,"end":505}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"internalPrice","loc":{"start":508,"end":521}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int","loc":{"start":523,"end":526}},"loc":{"start":523,"end":526}},"loc":{"start":523,"end":527}},"directives":[],"loc":{"start":508,"end":527}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"externalPrice","loc":{"start":530,"end":543}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int","loc":{"start":545,"end":548}},"loc":{"start":545,"end":548}},"loc":{"start":545,"end":549}},"directives":[],"loc":{"start":530,"end":549}}],"loc":{"start":467,"end":551}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Booking","loc":{"start":558,"end":565}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id","loc":{"start":570,"end":572}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":574,"end":576}},"loc":{"start":574,"end":576}},"loc":{"start":574,"end":577}},"directives":[],"loc":{"start":570,"end":577}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"endDate","loc":{"start":580,"end":587}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime","loc":{"start":589,"end":597}},"loc":{"start":589,"end":597}},"loc":{"start":589,"end":598}},"directives":[],"loc":{"start":580,"end":598}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"startDate","loc":{"start":601,"end":610}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime","loc":{"start":612,"end":620}},"loc":{"start":612,"end":620}},"loc":{"start":612,"end":621}},"directives":[],"loc":{"start":601,"end":621}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"firstName","loc":{"start":624,"end":633}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":635,"end":641}},"loc":{"start":635,"end":641}},"loc":{"start":635,"end":642}},"directives":[],"loc":{"start":624,"end":642}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lastName","loc":{"start":645,"end":653}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":655,"end":661}},"loc":{"start":655,"end":661}},"loc":{"start":655,"end":662}},"directives":[],"loc":{"start":645,"end":662}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"email","loc":{"start":665,"end":670}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":672,"end":678}},"loc":{"start":672,"end":678}},"loc":{"start":672,"end":679}},"directives":[],"loc":{"start":665,"end":679}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"phoneNumber","loc":{"start":682,"end":693}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":695,"end":701}},"loc":{"start":695,"end":701}},"loc":{"start":695,"end":702}},"directives":[],"loc":{"start":682,"end":702}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"cabin","loc":{"start":705,"end":710}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin","loc":{"start":712,"end":717}},"loc":{"start":712,"end":717}},"loc":{"start":712,"end":718}},"directives":[],"loc":{"start":705,"end":718}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"status","loc":{"start":721,"end":727}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Status","loc":{"start":729,"end":735}},"loc":{"start":729,"end":735}},"loc":{"start":729,"end":736}},"directives":[],"loc":{"start":721,"end":736}}],"loc":{"start":553,"end":738}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Organization","loc":{"start":744,"end":756}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id","loc":{"start":761,"end":763}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":765,"end":767}},"loc":{"start":765,"end":767}},"loc":{"start":765,"end":768}},"directives":[],"loc":{"start":761,"end":768}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name","loc":{"start":771,"end":775}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":777,"end":783}},"loc":{"start":777,"end":783}},"loc":{"start":777,"end":784}},"directives":[],"loc":{"start":771,"end":784}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"description","loc":{"start":787,"end":798}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":800,"end":806}},"loc":{"start":800,"end":806}},"loc":{"start":800,"end":807}},"directives":[],"loc":{"start":787,"end":807}},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"The members of the organization","block":true,"loc":{"start":810,"end":855}},"name":{"kind":"Name","value":"members","loc":{"start":858,"end":865}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Member","loc":{"start":868,"end":874}},"loc":{"start":868,"end":874}},"loc":{"start":868,"end":875}},"loc":{"start":867,"end":876}},"loc":{"start":867,"end":877}},"directives":[],"loc":{"start":810,"end":877}}],"loc":{"start":739,"end":879}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Member","loc":{"start":886,"end":892}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id","loc":{"start":897,"end":899}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":901,"end":903}},"loc":{"start":901,"end":903}},"loc":{"start":901,"end":904}},"directives":[],"loc":{"start":897,"end":904}},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"The user that is a member of the organization","block":true,"loc":{"start":907,"end":966}},"name":{"kind":"Name","value":"user","loc":{"start":969,"end":973}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User","loc":{"start":975,"end":979}},"loc":{"start":975,"end":979}},"loc":{"start":975,"end":980}},"directives":[],"loc":{"start":907,"end":980}},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"The organization the member is a member of","block":true,"loc":{"start":983,"end":1039}},"name":{"kind":"Name","value":"organization","loc":{"start":1042,"end":1054}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Organization","loc":{"start":1056,"end":1068}},"loc":{"start":1056,"end":1068}},"loc":{"start":1056,"end":1069}},"directives":[],"loc":{"start":983,"end":1069}},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"The role of the member in the organization","block":true,"loc":{"start":1072,"end":1128}},"name":{"kind":"Name","value":"role","loc":{"start":1131,"end":1135}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Role","loc":{"start":1137,"end":1141}},"loc":{"start":1137,"end":1141}},"loc":{"start":1137,"end":1142}},"directives":[],"loc":{"start":1072,"end":1142}}],"loc":{"start":881,"end":1144}},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"Role","loc":{"start":1151,"end":1155}},"directives":[],"values":[{"kind":"EnumValueDefinition","description":{"kind":"StringValue","value":"An admin of the organization, can do everything a member can,\n# and can also manage members in the organization and delete the organization.","block":true,"loc":{"start":1160,"end":1318}},"name":{"kind":"Name","value":"ADMIN","loc":{"start":1321,"end":1326}},"directives":[],"loc":{"start":1160,"end":1326}},{"kind":"EnumValueDefinition","description":{"kind":"StringValue","value":"A member of the organization, can do everything except\nmanage members in the organization and delete the organization.","block":true,"loc":{"start":1329,"end":1465}},"name":{"kind":"Name","value":"MEMBER","loc":{"start":1468,"end":1474}},"directives":[],"loc":{"start":1329,"end":1474}}],"loc":{"start":1146,"end":1476}},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"UpdateOrganizationInput","loc":{"start":1484,"end":1507}},"directives":[],"fields":[{"kind":"InputValueDefinition","description":{"kind":"StringValue","value":"The ID of the organization to update","block":true,"loc":{"start":1512,"end":1562}},"name":{"kind":"Name","value":"id","loc":{"start":1565,"end":1567}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":1569,"end":1571}},"loc":{"start":1569,"end":1571}},"loc":{"start":1569,"end":1572}},"directives":[],"loc":{"start":1512,"end":1572}},{"kind":"InputValueDefinition","description":{"kind":"StringValue","value":"The new name of the organization\nOmitting the value or passing null will leave the name unchanged","block":true,"loc":{"start":1575,"end":1690}},"name":{"kind":"Name","value":"name","loc":{"start":1693,"end":1697}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1699,"end":1705}},"loc":{"start":1699,"end":1705}},"directives":[],"loc":{"start":1575,"end":1705}},{"kind":"InputValueDefinition","description":{"kind":"StringValue","value":"The new description of the organization, cannot exceed 10 000 characters\nOmitting the value or passing null will leave the description unchanged","block":true,"loc":{"start":1708,"end":1870}},"name":{"kind":"Name","value":"description","loc":{"start":1873,"end":1884}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1886,"end":1892}},"loc":{"start":1886,"end":1892}},"directives":[],"loc":{"start":1708,"end":1892}}],"loc":{"start":1478,"end":1894}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"UpdateOrganizationResponse","loc":{"start":1901,"end":1927}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"organization","loc":{"start":1932,"end":1944}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Organization","loc":{"start":1946,"end":1958}},"loc":{"start":1946,"end":1958}},"loc":{"start":1946,"end":1959}},"directives":[],"loc":{"start":1932,"end":1959}}],"loc":{"start":1896,"end":1961}},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CreateOrganizationInput","loc":{"start":1969,"end":1992}},"directives":[],"fields":[{"kind":"InputValueDefinition","description":{"kind":"StringValue","value":"The name of the organization, must be unique and between 1 and 100 characters","block":true,"loc":{"start":1997,"end":2088}},"name":{"kind":"Name","value":"name","loc":{"start":2091,"end":2095}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":2097,"end":2103}},"loc":{"start":2097,"end":2103}},"loc":{"start":2097,"end":2104}},"directives":[],"loc":{"start":1997,"end":2104}},{"kind":"InputValueDefinition","description":{"kind":"StringValue","value":"The description of the organization, cannot exceed 10 000 characters","block":true,"loc":{"start":2107,"end":2189}},"name":{"kind":"Name","value":"description","loc":{"start":2192,"end":2203}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":2205,"end":2211}},"loc":{"start":2205,"end":2211}},"directives":[],"loc":{"start":2107,"end":2211}}],"loc":{"start":1963,"end":2213}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CreateOrganizationResponse","loc":{"start":2220,"end":2246}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"organization","loc":{"start":2251,"end":2263}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Organization","loc":{"start":2265,"end":2277}},"loc":{"start":2265,"end":2277}},"loc":{"start":2265,"end":2278}},"directives":[],"loc":{"start":2251,"end":2278}}],"loc":{"start":2215,"end":2280}},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"AddMemberInput","loc":{"start":2288,"end":2302}},"directives":[],"fields":[{"kind":"InputValueDefinition","description":{"kind":"StringValue","value":"The ID of the user to add to the organization","block":true,"loc":{"start":2307,"end":2366}},"name":{"kind":"Name","value":"userId","loc":{"start":2369,"end":2375}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":2377,"end":2379}},"loc":{"start":2377,"end":2379}},"loc":{"start":2377,"end":2380}},"directives":[],"loc":{"start":2307,"end":2380}},{"kind":"InputValueDefinition","description":{"kind":"StringValue","value":"The ID of the organization to add the user to","block":true,"loc":{"start":2383,"end":2442}},"name":{"kind":"Name","value":"organizationId","loc":{"start":2445,"end":2459}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":2461,"end":2463}},"loc":{"start":2461,"end":2463}},"loc":{"start":2461,"end":2464}},"directives":[],"loc":{"start":2383,"end":2464}},{"kind":"InputValueDefinition","description":{"kind":"StringValue","value":"The role of the user in the organization, defaults to Role.MEMBER","block":true,"loc":{"start":2467,"end":2546}},"name":{"kind":"Name","value":"role","loc":{"start":2549,"end":2553}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Role","loc":{"start":2555,"end":2559}},"loc":{"start":2555,"end":2559}},"directives":[],"loc":{"start":2467,"end":2559}}],"loc":{"start":2282,"end":2561}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AddMemberResponse","loc":{"start":2568,"end":2585}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"member","loc":{"start":2590,"end":2596}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Member","loc":{"start":2598,"end":2604}},"loc":{"start":2598,"end":2604}},"loc":{"start":2598,"end":2605}},"directives":[],"loc":{"start":2590,"end":2605}}],"loc":{"start":2563,"end":2607}},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"RemoveMemberInput","loc":{"start":2615,"end":2632}},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id","loc":{"start":2637,"end":2639}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":2641,"end":2643}},"loc":{"start":2641,"end":2643}},"loc":{"start":2641,"end":2644}},"directives":[],"loc":{"start":2637,"end":2644}}],"loc":{"start":2609,"end":2646}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"RemoveMemberResponse","loc":{"start":2653,"end":2673}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"member","loc":{"start":2678,"end":2684}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Member","loc":{"start":2686,"end":2692}},"loc":{"start":2686,"end":2692}},"loc":{"start":2686,"end":2693}},"directives":[],"loc":{"start":2678,"end":2693}}],"loc":{"start":2648,"end":2695}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation","loc":{"start":2702,"end":2710}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Create a new organization, and add the current user as an admin of the organization.","block":true,"loc":{"start":2715,"end":2813}},"name":{"kind":"Name","value":"createOrganization","loc":{"start":2816,"end":2834}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"data","loc":{"start":2835,"end":2839}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrganizationInput","loc":{"start":2841,"end":2864}},"loc":{"start":2841,"end":2864}},"loc":{"start":2841,"end":2865}},"directives":[],"loc":{"start":2835,"end":2865}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrganizationResponse","loc":{"start":2868,"end":2894}},"loc":{"start":2868,"end":2894}},"loc":{"start":2868,"end":2895}},"directives":[],"loc":{"start":2715,"end":2895}},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Update an organization with the given name and description.\nPassing null or omitting a value will leave the value unchanged.","block":true,"loc":{"start":2898,"end":3040}},"name":{"kind":"Name","value":"updateOrganization","loc":{"start":3043,"end":3061}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"data","loc":{"start":3062,"end":3066}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrganizationInput","loc":{"start":3068,"end":3091}},"loc":{"start":3068,"end":3091}},"loc":{"start":3068,"end":3092}},"directives":[],"loc":{"start":3062,"end":3092}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrganizationResponse","loc":{"start":3095,"end":3121}},"loc":{"start":3095,"end":3121}},"loc":{"start":3095,"end":3122}},"directives":[],"loc":{"start":2898,"end":3122}},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Add a member to the organization","block":true,"loc":{"start":3125,"end":3171}},"name":{"kind":"Name","value":"addMember","loc":{"start":3174,"end":3183}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"data","loc":{"start":3184,"end":3188}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddMemberInput","loc":{"start":3190,"end":3204}},"loc":{"start":3190,"end":3204}},"loc":{"start":3190,"end":3205}},"directives":[],"loc":{"start":3184,"end":3205}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddMemberResponse","loc":{"start":3208,"end":3225}},"loc":{"start":3208,"end":3225}},"loc":{"start":3208,"end":3226}},"directives":[],"loc":{"start":3125,"end":3226}},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Remove a member from the organization by the ID of the membership.","block":true,"loc":{"start":3229,"end":3309}},"name":{"kind":"Name","value":"removeMember","loc":{"start":3312,"end":3324}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"data","loc":{"start":3325,"end":3329}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveMemberInput","loc":{"start":3331,"end":3348}},"loc":{"start":3331,"end":3348}},"loc":{"start":3331,"end":3349}},"directives":[],"loc":{"start":3325,"end":3349}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveMemberResponse","loc":{"start":3352,"end":3372}},"loc":{"start":3352,"end":3372}},"loc":{"start":3352,"end":3373}},"directives":[],"loc":{"start":3229,"end":3373}}],"loc":{"start":2697,"end":3375}},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"UpdateUserInput","loc":{"start":3382,"end":3397}},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"firstName","loc":{"start":3402,"end":3411}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":3413,"end":3419}},"loc":{"start":3413,"end":3419}},"loc":{"start":3413,"end":3420}},"directives":[],"loc":{"start":3402,"end":3420}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"lastName","loc":{"start":3423,"end":3431}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":3433,"end":3439}},"loc":{"start":3433,"end":3439}},"loc":{"start":3433,"end":3440}},"directives":[],"loc":{"start":3423,"end":3440}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"phoneNumber","loc":{"start":3443,"end":3454}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":3456,"end":3462}},"loc":{"start":3456,"end":3462}},"directives":[],"loc":{"start":3443,"end":3462}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"allergies","loc":{"start":3465,"end":3474}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":3476,"end":3482}},"loc":{"start":3476,"end":3482}},"directives":[],"loc":{"start":3465,"end":3482}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"graduationYear","loc":{"start":3485,"end":3499}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int","loc":{"start":3501,"end":3504}},"loc":{"start":3501,"end":3504}},"directives":[],"loc":{"start":3485,"end":3504}}],"loc":{"start":3376,"end":3506}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"UsersResponse","loc":{"start":3513,"end":3526}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"users","loc":{"start":3531,"end":3536}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User","loc":{"start":3539,"end":3543}},"loc":{"start":3539,"end":3543}},"loc":{"start":3539,"end":3544}},"loc":{"start":3538,"end":3545}},"loc":{"start":3538,"end":3546}},"directives":[],"loc":{"start":3531,"end":3546}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"total","loc":{"start":3549,"end":3554}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int","loc":{"start":3556,"end":3559}},"loc":{"start":3556,"end":3559}},"loc":{"start":3556,"end":3560}},"directives":[],"loc":{"start":3549,"end":3560}}],"loc":{"start":3508,"end":3562}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"UserResponse","loc":{"start":3569,"end":3581}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"user","loc":{"start":3586,"end":3590}},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User","loc":{"start":3592,"end":3596}},"loc":{"start":3592,"end":3596}},"directives":[],"loc":{"start":3586,"end":3596}}],"loc":{"start":3564,"end":3598}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query","loc":{"start":3605,"end":3610}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"user","loc":{"start":3615,"end":3619}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserResponse","loc":{"start":3621,"end":3633}},"loc":{"start":3621,"end":3633}},"loc":{"start":3621,"end":3634}},"directives":[],"loc":{"start":3615,"end":3634}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"users","loc":{"start":3637,"end":3642}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UsersResponse","loc":{"start":3644,"end":3657}},"loc":{"start":3644,"end":3657}},"loc":{"start":3644,"end":3658}},"directives":[],"loc":{"start":3637,"end":3658}}],"loc":{"start":3600,"end":3660}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation","loc":{"start":3667,"end":3675}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateUser","loc":{"start":3680,"end":3690}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id","loc":{"start":3691,"end":3693}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":3695,"end":3697}},"loc":{"start":3695,"end":3697}},"loc":{"start":3695,"end":3698}},"directives":[],"loc":{"start":3691,"end":3698}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"data","loc":{"start":3700,"end":3704}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput","loc":{"start":3706,"end":3721}},"loc":{"start":3706,"end":3721}},"loc":{"start":3706,"end":3722}},"directives":[],"loc":{"start":3700,"end":3722}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User","loc":{"start":3725,"end":3729}},"loc":{"start":3725,"end":3729}},"loc":{"start":3725,"end":3730}},"directives":[],"loc":{"start":3680,"end":3730}}],"loc":{"start":3662,"end":3732}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"User","loc":{"start":3739,"end":3743}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id","loc":{"start":3748,"end":3750}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":3752,"end":3754}},"loc":{"start":3752,"end":3754}},"loc":{"start":3752,"end":3755}},"directives":[],"loc":{"start":3748,"end":3755}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lastName","loc":{"start":3758,"end":3766}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":3768,"end":3774}},"loc":{"start":3768,"end":3774}},"loc":{"start":3768,"end":3775}},"directives":[],"loc":{"start":3758,"end":3775}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"firstName","loc":{"start":3778,"end":3787}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":3789,"end":3795}},"loc":{"start":3789,"end":3795}},"loc":{"start":3789,"end":3796}},"directives":[],"loc":{"start":3778,"end":3796}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"username","loc":{"start":3799,"end":3807}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":3809,"end":3815}},"loc":{"start":3809,"end":3815}},"loc":{"start":3809,"end":3816}},"directives":[],"loc":{"start":3799,"end":3816}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createdAt","loc":{"start":3819,"end":3828}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime","loc":{"start":3830,"end":3838}},"loc":{"start":3830,"end":3838}},"loc":{"start":3830,"end":3839}},"directives":[],"loc":{"start":3819,"end":3839}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"firstLogin","loc":{"start":3842,"end":3852}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean","loc":{"start":3854,"end":3861}},"loc":{"start":3854,"end":3861}},"loc":{"start":3854,"end":3862}},"directives":[],"loc":{"start":3842,"end":3862}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"canUpdateYear","loc":{"start":3865,"end":3878}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean","loc":{"start":3880,"end":3887}},"loc":{"start":3880,"end":3887}},"loc":{"start":3880,"end":3888}},"directives":[],"loc":{"start":3865,"end":3888}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"graduationYear","loc":{"start":3891,"end":3905}},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int","loc":{"start":3907,"end":3910}},"loc":{"start":3907,"end":3910}},"directives":[],"loc":{"start":3891,"end":3910}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"phoneNumber","loc":{"start":3913,"end":3924}},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":3926,"end":3932}},"loc":{"start":3926,"end":3932}},"directives":[],"loc":{"start":3913,"end":3932}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"allergies","loc":{"start":3935,"end":3944}},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":3946,"end":3952}},"loc":{"start":3946,"end":3952}},"directives":[],"loc":{"start":3935,"end":3952}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"graduationYearUpdatedAt","loc":{"start":3955,"end":3978}},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime","loc":{"start":3980,"end":3988}},"loc":{"start":3980,"end":3988}},"directives":[],"loc":{"start":3955,"end":3988}}],"loc":{"start":3734,"end":3990}}],"loc":{"start":0,"end":3991}} as unknown as DocumentNode