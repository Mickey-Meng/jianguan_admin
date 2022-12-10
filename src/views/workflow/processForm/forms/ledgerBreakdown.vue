<template>
  <div class="form-process">
    <wti-form :fields="fields" :all-disabled="disabled" :border-form="false" label-position="right" :data="originData">
    </wti-form>
  </div>
</template>

<script>
import fields from '../config/ledgerBreakdown';
export default {
  props: {
    originData: {
      type: Object,
      default: {}
    },
    disabled: {
      type: Boolean,
      defaule: false
    }
  },
  data () {
    return {
      fields,
    }
  }
}
</script>