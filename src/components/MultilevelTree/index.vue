<template>
  <div class="wti-tree">
    <template v-for="node in treeList">
      <WtiTreeNode
        :key="node[defaultProps.id]"
        :default-props="defaultProps"
        :selected-id="selectedId"
        :select-row="selectRow"
        :collapse-node="collapseNode"
        :collapse-node-list="collapseNodeList"
        :node-data="node"
      ></WtiTreeNode>
    </template>
  </div>
</template>

<script>
import WtiTreeNode from "./node";

export default {
  name: "WtiTree",
  components: {
    WtiTreeNode,
  },
  props: {
    // 父组件传下来的原始数据，要求是一个数组
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          label: "label",
          id: "label",
        };
      },
    },
    filterNodeMethod: {
      type: Function,
      default: () => {
        return true;
      },
    },
  },
  data() {
    return {
      // 叶子节点的所有选中节点。
      // 而非叶子节点的选中状态，都是通过 leafCheckList 和 data 算出来的
      leafCheckList: [],
      collapseNodeList: [],
      selectedId: "",
    };
  },
  computed: {
    treeList() {
      // 显示规则：
      // 1. 当某节点是叶子节点时，从该节点追溯其父节点，一律显示（但不显示其兄弟节点）
      // 2. 当某节点是非叶子节点时，其【所有】子节点显示，并且从该节点追溯其父节点，一律显示（但不显示其兄弟节点）
      const list = this.recursionTree(this.list, this.filterNodeMethod);
      console.log(list);
      return list;
    },
  },
  methods: {
    // 点击一个节点，切换其选中/非选中状态（同时会影响其子节点和父节点）
    selectRow(nodeData) {
      this.selectedId = nodeData.id;
      this.$emit("selectRow", nodeData);
    },

    // 折叠
    collapseNode(id) {
      const index = this.collapseNodeList.indexOf(id);
      if (index > -1) {
        this.collapseNodeList = this.collapseNodeList.filter(
          (item) => item !== id
        );
      } else {
        this.collapseNodeList.push(id);
      }
    },

    // data 指一个数组（树的某个节点下面的所有子节点）
    // searchText 指搜索关键字
    // mustShow，指该节点必须显示
    recursionTree(data, matchMethods) {
      return data
        .map((node) => {
          const label = node[this.defaultProps.label];
          const children = node[this.defaultProps.children];
          // label 匹配成功，说明该节点符合要求。终止递归
          if (matchMethods(label, node)) {
            if (!node.children) {
              return node;
            }
          }
          // 如果没有children，说明是叶子节点，不需要递归。
          // 并且因为在上面做了匹配处理，所以这里必然是未匹配成功，所以返回空（在后面fitler时干点欧塔）
          if (!children) {
            return null;
          }
          // 递归 children
          const list = this.recursionTree(children, matchMethods);

          // 如果返回children了，说明子节点里有匹配成功的，那么当前节点也应该被显示
          if (list.length > 0) {
            // 但是因为子节点里不一定全部被匹配到，所以应该用返回的匹配成功的子节点，替换所有子节点数据
            return Object.assign({}, node, {
              children: list,
            });
          } else {
            // 此时说明所有子节点都未匹配成功，并且当前节点也未匹配成功，所以返回 null
            return null;
          }
        })
        .filter((node) => node); // filter 用于过滤所有匹配未成功的选项
    },
  },
};
</script>

<style scoped lang="scss">
.wti-tree {
  width: 100%;
  height: 100%;
  // border: 1px solid red;
  overflow: auto;
}
</style>
