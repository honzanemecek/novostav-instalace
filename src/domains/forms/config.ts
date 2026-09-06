// Build-time public API of the forms domain: Payload block config + plugin.
// Kept separate from index.ts so that config consumers (payload.config.ts,
// other domains' collection configs) never pull the React component tree
// (and its CSS imports) into the Payload CLI's module graph.
export { FormBlock as FormBlockConfig } from './blocks/FormBlock/config'
export { Inquiry as InquiryBlockConfig } from './blocks/Inquiry/config'
export { formsPlugin } from './plugin'
