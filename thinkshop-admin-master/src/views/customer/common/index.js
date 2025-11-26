// 人群定义数据处理
export function formatRules(rule) {
  const dictList = [
    {label: '有购买', type: 1},
    {label: '无购买', type: 2},
    {label: '有下单', type: 3},
    {label: '无下单', type: 4},
    {label: '有加购', type: 5},
    {label: '无加购', type: 6},
    {label: '有访问', type: 7},
    {label: '无访问', type: 8},
    {label: '购买次数', type: 9},
    {label: '购买金额', type: 10},
    {label: '标签', type: 11}
  ]
  if(!rule) return ''
  const r = JSON.parse(rule)
  const rList = []
  Object.keys(r).forEach(key => {
    let str = ''
    let {label} = dictList.find(it => it.type===Number(key))
    let val = r[key]
    if(key<9) {
      str = `最近${val}天${label}`
    }
    if(['9', '10'].includes(key)) {
      const ob = {
        1:'大于',
        3:'等于',
        2:'小于'
      }
      str = `${label}${ob[val.condition]}${val.value}${key==='9'?'次':''}`
    }
    if(key==='11') {
      // let tagName = tagList.value.filter(it => val.includes(it.id)).map(it=>it.name).join('、')
      let tagName = val.map(it=>it.name).join('、')
      str =  `标签为${tagName}`
    }
    rList.push(str)
  })
  return rList.join(',')
}