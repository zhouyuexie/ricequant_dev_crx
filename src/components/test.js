riot.tag2('todo', '<h3>{opts.title}</h3> <ul> <li each="{items}"> <label class="{completed: done}"> <input type="checkbox" checked="{done}" onclick="{parent.toggle}"> {title} </label> </li> </ul> <form onsubmit="{add}"> <input ref="input" onkeyup="{edit}"> <button disabled="{!text}">Add #{items.length + 1}</button> </form>', '', '', function(opts) {
    this.items = opts.items

    this.edit = function(e) {
      this.text = e.target.value
    }.bind(this)

    this.add = function(e) {
      e.preventDefault()
      if (this.text) {
        this.items.push({ title: this.text })
        this.text = this.refs.input.value = ''
      }
    }.bind(this)

    this.toggle = function(e) {
      var item = e.item
      item.done = !item.done
    }.bind(this)
});