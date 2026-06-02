import {
  MAX_EMOTION_TAGS,
  formatEmotionTagsForApi,
  toggleEmotionTag,
} from '../src/utils/emotionTagUtils.js'

let passed = 0
let failed = 0

function assert(name, condition) {
  if (condition) {
    passed += 1
    console.log(`PASS: ${name}`)
  } else {
    failed += 1
    console.error(`FAIL: ${name}`)
  }
}

let result = toggleEmotionTag([], '#불안')
assert('select first tag', result.tags.join(',') === '불안' && !result.limitReached)

result = toggleEmotionTag(['불안'], '#불안')
assert('deselect tag', result.tags.length === 0)

let tags = []
for (const tag of ['#불안', '#긴장', '#혼란', '#당황', '#억울함', '#서운함']) {
  result = toggleEmotionTag(tags, tag)
  tags = result.tags
}
assert('sixth tag blocked', tags.length === MAX_EMOTION_TAGS && result.limitReached)

assert(
  'api payload',
  formatEmotionTagsForApi(['불안', '희망']) === '#불안,#희망',
)

assert('empty payload', formatEmotionTagsForApi([]) === undefined)

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed > 0 ? 1 : 0)
