<template>
  <div>
  <Row :gutter="20">
    <!-- <i-col :md="24" :lg="5" style="margin-bottom: 20px;">
      <Card>
        <Tree ref="tree" :data="tagTreeData"  @on-select-change="handlerTreeChange" getSelectedNodes></Tree>
      </Card>
    </i-col>
    <i-col :md="24" :lg="19" style="margin-bottom: 20px;"> -->
      <Card shadow>
        <div class="search-con search-con-top">
            <Select
                v-model="searchKey"
                class="search-col"
            >
                <Option
                v-for="item in columns2"
                v-if="item.key !== 'id' && item.key !== 'handle' && item.key !== 'group_remarks' && item.key !== ''"
                :key="item.key"
                :value="item.key"
                >{{ item.title }}</Option>
            </Select>
            <Input
                @on-change="handleClear"
                clearable
                placeholder="输入关键字搜索"
                class="search-input"
                v-model="searchValue"
            />
            <Button
                @click="handleSearch"
                class="search-btn"
                type="primary"
            >搜索</Button>
            <slot name="new_btn"><Button
            type="primary"
            @click="handlergroups('', 'post', '添加分组')"
            class="search-btn"
            >添加分组</Button></slot>
            <Button type="error" class="search-btn"  @click="handlerDelete">批量删除</Button>
        </div>

        <Table
        size="small"
        ref="selection"
        border
        :columns="columns2"
        :data="tableData"
        @on-selection-change="handleSelectChange"
         ></Table>

        <div style="margin: 10px; overflow: hidden">
          <div style="float: left;">
              <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[15,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize">
              </Page>
          </div>
        </div>
      </Card>
    <!-- </i-col> -->
  </Row>
    <Modal v-model="modalMap2.modalVisible"  :title="modalMap2.modalTitle" :loading=true :footer-hide=true width="540" :mask-closable=false>
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="85">
        <!-- <alert>温馨提示：只有描述可以不填</alert> -->
        <FormItem label="分组名称" prop="group_name">
          <i-input v-model="formValidate2.group_name" :maxlength="50" placeholder='请输入分组名称'></i-input>
        </FormItem>
        <FormItem label="分组描述" prop="group_remarks">
          <i-input v-model="formValidate2.group_remarks" :maxlength="255" placeholder='请输入分组描述'></i-input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitLinksGroup('formValidate2')">提交</Button>
          <Button @click="handleReset('formValidate2')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { operationlinksgroup, getlinksgrouplist } from '@/api/links'

export default {
  data () {
    return {
      // 分页
      ruleLoading: false,
      ruleModal: false,
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      selectTwo: 'tag',
      selectTag: null,
      tagTreeData: [],
      searchVal: '',
      modalMap2: {
        modalVisible: false,
        modalTitle: '新建分组'
      },
      editModalData: null,
      tableData: [],
      //
      tableSelectIdList: [],
      //
      searchKey: '',
      searchValue: '',
      formValidate2: {
        id: null,
        tag_name: '',
        dbs: [],
        servers: [],
        users: [],
        proxy_host: ''
      },
      formValidateTagrule: {
        id: null,
        name: '',
        idc_rule: '',
        hostname_rule: '',
        tag_name: ''
      },
      ruleValidate2: {
        group_name: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }]
      },
      columns2: [
        { type: 'selection', key: 'id', width: 80, align: 'center' },
        { title: '分组名称', key: 'group_name', align: 'center' },
        { title: '分组描述', key: 'group_remarks', align: 'center' },
        {
          title: '操作',
          key: 'handle',
          width: 140,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '2px'
                  },
                  on: {
                    click: () => {
                      this.handlergroups(params.row, 'put', '更新分组')
                    }
                  }
                },
                '更新'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handlerDeleteLinksGroup(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ]
    }
  },
  methods: {
    getLinksGroupList (key, value) {
      getlinksgrouplist(this.pageNum, this.pageSize, key, value).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
          this.pageTotal = res.data.count
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 添加标签
    handlergroups (paramsRow, meth, mtitle) {
      this.modalMap2.modalVisible = true
      this.modalMap2.modalTitle = mtitle
      this.editModalData = meth
      //
      // this.getLinksGroupList()
      if (paramsRow && paramsRow.id) {
        this.formValidate2 = {
          id: paramsRow.id,
          group_name: paramsRow.group_name,
          group_remarks: paramsRow.group_remarks
        }
      } else {
        this.formValidate2 = {
          id: null,
          group_name: '',
          group_remarks: ''
        }
      }
    },
    closeTagModal () {
      // 关闭modal
      this.modalMap2.modalVisible = false
    },
    handlerDelete () {
      // console.log('长度',this.tableSelectIdList.length)
      if (this.tableSelectIdList.length > 3) {
        this.$Message.error(`批量删除最多三个`)
        return
      }
      if (this.tableSelectIdList.length > 0) {
        if (this.selectTwo === 'tag') {
          if (confirm(`确定要批量删除选中的分组`)) {
            operationlinksgroup({ 'id_list': this.tableSelectIdList }, 'delete').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getLinksGroupList('group_name', this.searchVal)
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
          }
        }
      } else {
        this.$Message.info(`你总要选中点什么吧`)
      }
    },
    handlerDeleteLinksGroup (params) {
      if (confirm(`确定要删除分组 ${params.row.group_name}`)) {
        operationlinksgroup({ group_id: params.row.id }, 'delete').then(
          res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.getLinksGroupList('group_name', this.searchVal)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
      }
    },
    handleSubmitLinksGroup (value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            operationlinksgroup(this.formValidate2, this.editModalData).then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getLinksGroupList('group_name', this.searchVal)
                  // this.getTagTree()
                  this.modalMap2.modalVisible = false
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              }
            )
          }, 1000)
        } else {
          this.$Message.error('表单校验错误')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 翻页
    changePage (value) {
      this.pageNum = value
      this.getLinksGroupList()
    },
    // 切换分页
    handlePageSize (value) {
      this.pageSize = value
      this.pageNum = 1
      this.getLinksGroupList()
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
      this.getLinksGroupList()
    },
    handleSearch () {
      this.getLinksGroupList(this.searchKey, this.searchValue)
    },
    // table 选中的ID
    handleSelectChange (val) {
      let SelectIdList = []
      val.forEach(item => {
        SelectIdList.push(item.id)
      })
      this.tableSelectIdList = SelectIdList
    }
  },
  watch: {
    // searchVal (val) {
    //   this.searchVal = val
    //   if(this.selectTwo === 'tag'){
    //     this.getTagList("tag_name", this.searchVal)
    //   }else if(this.selectTwo === 'DB'){
    //     this.getDBList(this.searchVal)
    //   }else if(this.selectTwo === 'server'){
    //     this.getServerList(this.searchVal)
    //   }
    // }
  },
  mounted () {
    // this.getTagTree()
    this.getLinksGroupList()
  }
}
</script>
<style lang="less" scoped>
  .search-con {
    padding: 10px 0;
    .search {
      &-col {
        display: inline-block;
        width: 160px;
      }
      &-input {
        display: inline-block;
        width: 250px;
        margin-left: 1px;
      }
      &-input-long {
        display: inline-block;
        width: 480px;
        margin-left: 1px;
      }
      &-btn {
        margin-left: 2px;
      }
    }
  }
</style>
