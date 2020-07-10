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
                v-if="item.key !== 'id' && item.key !== 'handle' && item.key !== 'links_remarks' && item.key !== 'links_password' && item.key !== ''"
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
            @click="handlerLinks('', 'post', '添加链接')"
            class="search-btn"
            >添加链接</Button></slot>
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
        <FormItem label="链接名称" prop="links_name">
          <i-input v-model="formValidate2.links_name" :maxlength="50" placeholder='请输入链接名称'></i-input>
        </FormItem>
        <FormItem label="链接地址" prop="links_url">
          <i-input v-model="formValidate2.links_url" :maxlength="100" placeholder='请输入链接地址'></i-input>
        </FormItem>
        <FormItem label="登录账号" prop="links_user">
          <i-input v-model="formValidate2.links_user" :maxlength="50" placeholder='请输入登录账号'></i-input>
        </FormItem>
        <FormItem label="登录密码" prop="links_password">
          <i-input v-model="formValidate2.links_password" :maxlength="255" placeholder='请输入登录密码'></i-input>
        </FormItem>
        <FormItem label="链接分组" prop="links_group">
          <Select class="search-input-long" v-model="formValidate2.links_group" filterable placeholder="请选择链接分组">
            <Option v-for="item in allGroupList" :value="item.id" :key="item.id">{{ item.group_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="链接描述" prop="links_remarks">
          <i-input v-model="formValidate2.links_remarks" :maxlength="255" placeholder='请输入链接描述'></i-input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitLinks('formValidate2')">提交</Button>
          <Button @click="handleReset('formValidate2')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { getlinkslist, operationlinks, getlinksgrouplist } from '@/api/links'

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
        modalTitle: '新建链接'
      },
      editModalData: null,
      tableData: [],
      tableDataTagrule: [],
      tableDataServer: [],
      tableDataDB: [],
      //
      allGroupList: [],
      allDBList: [],
      allUser: [],
      allTagList: [],
      allProxyList: [],
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
        links_name: [{ required: true, message: '链接名称不能为空', trigger: 'change' }],
        links_url: [{ required: true, message: '链接URL不能为空', trigger: 'change' }],
        links_group: [{ required: true, type: 'number', message: '请选择分组', tigger: 'blur' }]
      },

      columns2: [
        { type: 'selection', key: 'id', width: 80, align: 'center' },
        { title: '链接名称',
          key: 'links_name',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a', {
                on: {
                  click: () => {
                    // this.$Message.error(`待完善`)
                    window.open(params.row.links_url)
                  }
                }
              },
              params.row.links_name
              )
            ])
          }
        },
        {
          title: '链接地址',
          key: 'links_url',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a', {
                on: {
                  click: () => {
                    // this.$Message.error(`待完善`)
                    window.open(params.row.links_url)
                  }
                }
              },
              params.row.links_url
              )
            ])
          }
        },
        { title: '链接分组', key: 'group_name', align: 'center' },
        { title: '登录账号', key: 'links_user', align: 'center' },
        { title: '登录密码', key: 'links_password', align: 'center' },
        { title: '链接描述', key: 'links_remarks', align: 'center' },
        { title: '操作',
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
                      this.handlerLinks(params.row, 'put', '更新链接')
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
                      this.handlerDeleteLinks(params)
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
    getLinksList (key, value) {
      getlinkslist(this.pageNum, this.pageSize, key, value).then(res => {
        if (res.data.code === 0) {
          this.allGroupList.forEach(function (v) {
            res.data.data.forEach(function (v1) {
              if (v1.links_group === v.id) {
                v1.group_name = v.group_name
              }
            })
          })
          this.tableData = res.data.data
          this.pageTotal = res.data.count
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    getLinksGroupList () {
      getlinksgrouplist(1, 888).then(res => {
        if (res.data.code === 0) {
          // this.$Message.success(`${res.data.msg}`)
          this.allGroupList = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 添加标签
    handlerLinks (paramsRow, meth, mtitle) {
      this.modalMap2.modalVisible = true
      this.modalMap2.modalTitle = mtitle
      this.editModalData = meth
      //
      // this.getLinksGroupList()
      if (paramsRow && paramsRow.id) {
        this.formValidate2 = {
          id: paramsRow.id,
          links_name: paramsRow.links_name,
          links_url: paramsRow.links_url,
          links_group: paramsRow.links_group,
          links_remarks: paramsRow.links_remarks,
          links_user: paramsRow.links_user,
          links_password: paramsRow.links_password
        }
      } else {
        this.formValidate2 = {
          id: null,
          links_name: '',
          links_url: '',
          links_group: 0,
          links_remarks: '',
          links_user: '',
          links_password: ''
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
          if (confirm(`确定要批量删除选中的标签`)) {
            operationlinks({ 'id_list': this.tableSelectIdList }, 'delete').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getLinksList('tag_name', this.searchVal)
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
    handlerDeleteLinks (params) {
      if (confirm(`确定要删除标签 ${params.row.links_name}`)) {
        operationlinks({ link_id: params.row.id }, 'delete').then(
          res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.getLinksList('tag_name', this.searchVal)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
      }
    },
    handleSubmitLinks (value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            operationlinks(this.formValidate2, this.editModalData).then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getLinksList('links_name', this.searchVal)
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
      this.getLinksList()
    },
    // 切换分页
    handlePageSize (value) {
      this.pageSize = value
      this.pageNum = 1
      this.getLinksList()
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
      this.getLinksList()
    },
    handleSearch () {
      this.getLinksList(this.searchKey, this.searchValue)
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
    //     this.getTagList('tag_name', this.searchVal)
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
    this.getLinksList()
  }
}
</script>
<style lang='less' scoped>
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
