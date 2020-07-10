<template>
  <div>
    <Row :gutter="10">
      <i-col :md="24" :lg="4" style="margin-bottom: 20px;">
        <Card>
          <Tree
            ref="tree"
            :data="privateTreeData"
            @on-select-change="handlerTreeChange"
            getSelectedNodes
          ></Tree>
        </Card>
      </i-col>
      <i-col :md="24" :lg="20" style="margin-bottom: 10px;">
        <Card>
          <div class="search-con search-con-top">
            <!-- <Input class="search-input" v-model="searchVal" style="padding:5px;" placeholder="输入关键字全局搜索"/> -->
            <Select v-model="searchKey" class="search-col">
              <Option v-for="item in columns"
                      v-if="item.key == 'domain_name'"
                      :key="item.key"
                      :value="item.key">
                {{ item.title }}
              </Option>
            </Select>
            <Input @on-change="handleClear"
                   clearable
                   placeholder="输入关键字全局搜索"
                   class="search-input"
                   v-model="searchValue" />
            <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
            <Button type="primary" class="search-btn" @click="exportData(2)">
              <Icon type="ios-download-outline"></Icon>导出数据
            </Button>
          </div>

          <!-- <Table size="small" ref="selection" border :columns="columns":data="tableData"@on-selection-change="handleSelectChange"></Table> -->
          <Table
            size="small"
            ref="selection"
            :columns="columns"
            :data="tableData"
            @on-selection-change="handleSelectChange"
          ></Table>
          <div style="margin: 10px; overflow: hidden">
            <div style="float: left;">
              <Page
                :total="pageTotal"
                :current="pageNum"
                :page-size="pageSize"
                :page-size-opts="[15,35,50,100,200,500,1000]"
                show-sizer
                show-total
                @on-change="changePage"
                @on-page-size-change="handlePageSize"
              ></Page>
            </div>
          </div>
          <Modal
            v-model="modalMap.modalVisible"
            :title="modalMap.modalTitle"
            :loading="true"
            :footer-hide="true"
            :mask-closable="false"
          >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
              <Alert closable>管理用户：用来登陆你的主机获取资产信息，请务必配置！</Alert>
              <div v-if="editModalData && editModalData == 'put'">
                <FormItem label="主机名称" prop="hostname">
                  <i-input v-model="formValidate.hostname" :maxlength="45" placeholder="请输入主机名"></i-input>
                </FormItem>
              </div>
              <div v-else>
                <FormItem label="主机名" prop="hostname">
                  <i-input v-model="formValidate.hostname" :maxlength="45" placeholder="请输入主机名"></i-input>
                </FormItem>
              </div>
              <FormItem label="IP" prop="ip">
                <i-input v-model="formValidate.ip" :maxlength="45" placeholder="请输入IP地址"></i-input>
              </FormItem>
              <FormItem label="公网IP" prop="public_ip">
                <i-input v-model="formValidate.public_ip" :maxlength="45" placeholder="公网IP"></i-input>
              </FormItem>
              <FormItem label="端口">
                <i-input v-model="formValidate.port" :maxlength="5" placeholder="端口"></i-input>
              </FormItem>
              <!-- <FormItem label="IDC" prop="idc">
          <Select v-model="formValidate.idc" placeholder="选择IDC机房">
            <Option value="AWS" >AWS</Option>
            <Option value="阿里云" >阿里云</Option>
            <Option value="腾讯云" >腾讯云</Option>
            <Option value="华为云" >华为云</Option>
            <Option value="内网" >内网</Option>
            <Option value="其他" >其他</Option>
          </Select>
              </FormItem>-->
              <FormItem label="IDC" prop="idc">
                <Select
                  class="search-input-long"
                  v-model="formValidate.idc"
                  filterable
                  multiple
                  placeholder="选择IDC机房"
                >
                  <Option
                    v-for="item in allIDCList"
                    :value="item.name"
                    :key="item.id"
                  >{{ item.name }}</Option>
                </Select>
              </FormItem>

              <FormItem label="区域" prop="region">
                <i-input
                  v-model="formValidate.region"
                  :maxlength="45"
                  placeholder="Region区域，如：cn-shanghai, us-east-1"
                ></i-input>
              </FormItem>

              <FormItem label="管理用户" prop="admin_user">
                <Select v-model="formValidate.admin_user" placeholder="请选择一个管理用户" filterable>
                  <Option v-for="item in admUserList" :key="item" :value="item.admin_user">{{item.admin_user}}</Option>
                </Select>
              </FormItem>
              <FormItem label="标签" prop="tag_list">
                <Select
                  class="search-input-long"
                  v-model="formValidate.tag_list"
                  filterable
                  multiple
                  placeholder="请选择关联的标签"
                >
                  <Option
                    v-for="item in allTagList"
                    :value="item.tag_name"
                    :key="item.id"
                  >{{ item.tag_name }}</Option>
                </Select>
              </FormItem>
              <FormItem label="备注" prop="detail">
                <i-input
                  v-model="formValidate.detail"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 10}"
                  :maxlength="50"
                  placeholder="简单描述下吧"
                ></i-input>
              </FormItem>

              <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
              </FormItem>
            </Form>
          </Modal>
          <!-- <Modal v-model="modalMaplinkTag.modalVisible" :title="modalMaplinkTag.modalTitle" :loading=true :footer-hide=true :mask-closable=false>
     <Form ref="formValidateLinkTag" :model="formValidateLinkTag" :label-width="80">
        <CheckboxGroup v-model="formValidateLinkTag.link_tag_list">
          <Checkbox v-for="item in allTagList" :key="item.id"   :label="item.id" >
            <span style="font-size:12px">{{item.tag_name}}</span>
          </Checkbox>
        </CheckboxGroup>
        <Button type="primary" @click="handleSubmitlinkTag('formValidateLinkTag')">提交</Button>
     </Form>
          </Modal>-->
        </Card>
      </i-col>
    </Row>
    <Drawer v-model="logModal" :closable="false" style="background-color: #f8f8f9" width="820">
      <h2 style="color: #000000; marginLeft: 10px">错误日志：</h2>
      <div style="padding: 10px">
        <Row v-for="log in logInfo" :key="log.id">
          <i-col span="24">
            <p style="color: #000000">{{log.create_time}} ：{{log.error_log}}</p>
          </i-col>
        </Row>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { getprivatetree, getprivatelist } from '@/api/dnsprivate.js'
import { getdomainlist, operationdomains } from '@/api/dns/domainlist.js'
import { mapState } from 'vuex'
export default {
  components: {},
  data () {
    return {
      formValidateLinkTag: {
        link_tag_list: []
      },
      modalMaplinkTag: {
        modalVisible: false,
        modalTitle: '选择你要关联的标签'
      },
      formData_multi: {
        data: null
      },
      multi_dialog: {
        show: false,
        title: '批量添加'
      },
      loading: false,
      SSHloading: false,
      logModal: false,
      logInfo: [],
      privateTreeData: [],
      serverDetail: Object,
      dialog2: {
        show: false,
        title: '主机详情'
      },
      formValidate: {
        hostname: '',
        ip: '',
        public_ip: '',
        port: '22',
        region: '',
        admin_user: '',
        tag_list: [],
        detail: ''
      },
      searchVal: '',
      single: false,
      loadingStatus: false,
      tableData: [],
      providerlist: [],
      admUserList: [],
      allTagList: [],
      allIDCList: [],
      tableSelectIdList: [],
      modalMap: {
        modalVisible: false,
        modalTitle: '新建'
      },
      formList: [],
      editModalData: '',
      pageNum: 1, // 当前页码
      pageTotal: 0, // 数据总数
      pageSize: 15, // 每页条数
      //
      searchKey: '',
      searchValue: '',

      ruleValidate: {
        admin_user: [
          { required: true, message: '请选择管理用户', trigger: 'change' }
        ],
        hostname: [
          {
            required: true,
            message: 'The name cannot be empty',
            trigger: 'blur'
          }
        ],
        ip: [
          {
            required: true,
            message: '请输入IP',
            trigger: 'blur'
          }
        ],
        port: [
          {
            required: true,
            message: '请输入端口',
            trigger: 'blur'
          }
        ]
      },
      columns: [
        {
          type: 'selection',
          key: 'id',
          width: 60,
          align: 'center'
        },
        {
          title: '域名',
          key: 'domain_name',
          minWidth: 150,
          // width: 350,
          align: 'center',
          // fixed: 'left',
          sortable: true,
          render: (h, params) => {
            return h(
              'a',
              {
                on: {
                  click: () => {
                    this.handleDetail(params.row)
                  }
                }
              },
              params.row.domain_name
            )
          }
        },
        {
          title: '平台账户',
          key: 'provider_name',
          minWidth: 150,
          align: 'center',
          sortable: true
        },
        {
          title: '域名状态',
          key: 'domain_status',
          minWidth: 100,
          align: 'center',
          sortable: true
        },
        {
          title: '购买时间',
          key: 'create_time',
          width: 180,
          align: 'center',
          sortable: true
        },
        {
          title: '过期时间',
          key: 'expired_time',
          width: 180,
          align: 'center',
          sortable: true,
          render: (h, params) => {
            let etime = params.row.expired_time
            let nowtime = new Date()
            let EtimeSplit = etime.split(' ')
            let DEtime = EtimeSplit[0].split('-')
            let TEtime = EtimeSplit[1].split(':')
            let ETime = new Date(DEtime[0], DEtime[1] - 1, DEtime[2], TEtime[0], TEtime[1], TEtime[2])
            let eDays = parseInt((ETime - nowtime) / (24 * 3600 * 1000))
            if (eDays <= 7) {
              return h('div', { style: { background: 'orange', color: 'white' } }, etime)
            } else if (eDays <= 3) {
              return h('div', { style: { background: 'red', color: 'white' } }, etime)
            } else {
              return h('div', { style: { background: 'green', color: 'white' } }, etime)
            }
          }
        }
        /* {
          title: '自动续订',
          key: 'auto_renew',
          width: 100,
          align: 'center',
          render: (h, params) => {
            let state = params.row.auto_renew
            if (state === 0) {
              return h('div', [
                h('Tag', { props: { color: 'default' } }, '否')
              ])
            } else if (state === 1) {
              return h('div', [
                h('Tag', { props: { color: 'success' } }, '是')
              ])
            }
          }
        },
        {
          title: '操作',
          key: 'handle',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                    // loading: this.SSHloading
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.webTerminnal(params, 'server')
                      //window.open('/terminal/?id=' + params.row.id)
                    }
                  }
                },
                'SSH'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editModal(params.row, 'put', '更新域名')
                    }
                  }
                },
                '编辑'
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
                      this.delData(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        } */
      ]
    }
  },
  methods: {
    // 导出数据、支持分页、过滤、搜索、排序后导出
    exportData (type) {
      if (type === 1) {
        this.$refs.selection.exportCsv({
          filename: 'codo_cmdb_original_data'
        })
      } else if (type === 2) {
        this.$refs.selection.exportCsv({
          filename: 'codo_cmdb_sorting_and_filtering_data',
          original: false
        })
      } else if (type === 3) {
        this.$refs.selection.exportCsv({
          filename: 'codo_cmdb_custom_data',
          columns: this.columns8.filter((col, index) => index < 4),
          data: this.data7.filter((data, index) => index < 4)
        })
      }
    },

    // // 反向关联标签，支持多对多批量
    // handleSubmitlinkTag(value) {
    //   const data = {
    //     'tag_list': this.formValidateLinkTag.link_tag_list,
    //     'server_list': this.tableSelectIdList,
    //   }
    //   console.log('new_data--->', data)
    //   // console.log(this.formValidateLinkTag)
    //   // console.log('allTagList',this.allTagList)
    //   // this.$refs[value].validate((valid) => {
    //   //   if (valid) {
    //   //     setTimeout(() => {
    //   //       operationTag(this.formValidate2, this.editModalData).then(
    //   //         res => {
    //   //           if (res.data.code === 0) {
    //   //             this.$Message.success(`${res.data.msg}`)
    //   //             this.getTagList('tag_name', this.searchVal)
    //   //             // this.getTagTree()
    //   //             this.modalMap2.modalVisible = false
    //   //           } else {
    //   //             this.$Message.error(`${res.data.msg}`)
    //   //           }
    //   //         }
    //   //       )
    //   //     }, 1000)
    //   //   } else {
    //   //     this.$Message.error('表单校验错误')
    //   //   }
    //   // })
    // },

    // 点击关联标签按钮
    HandlelinkTag () {
      console.log('长度', this.tableSelectIdList.length)
      if (this.tableSelectIdList.length > 1000) {
        this.$Message.error('一次性最多关联1000台')
        return
      }
      if (this.tableSelectIdList.length > 0) {
        this.modalMaplinkTag.modalVisible = true
      } else {
        this.$Message.info(`请选择你要关联的主机`)
      }
    },

    // 批量添加
    handlemultiAdd () {
      this.multi_dialog = {
        show: true,
        title: '批量添加主机'
      }
    },
    closeMultiModal () {
      this.formData_multi = {
        data: null
      }
      this.multi_dialog.show = false
    },
    handleErrorLog (value) {
      this.logModal = true
      getErrorLog('ip', value).then(res => {
        if (res.data.code === 0) {
          this.logInfo = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerCheckErrorLog () {
      this.logModal = true
      getErrorLog().then(res => {
        if (res.data.code === 0) {
          this.logInfo = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取PrivateTree
    getPrivateTree (key) {
      getprivatetree(key).then(res => {
        if (res.data.code === 0) {
          this.privateTreeData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取主机信息
    getDomainList (key, value) {
      getdomainlist(this.pageNum, this.pageSize, key, value).then(res => {
        if (res.data.code === 0) {
          this.providerlist.forEach(function (v) {
            res.data.data.forEach(function (v1) {
              if (v1.domain_provider === v.id) {
                v1.provider_name = v.pro_name
              }
            })
          })
          this.pageTotal = res.data.count
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取账户列表
    getPrivateList (key, value) {
      getprivatelist(key, value).then(res => {
        if (res.data.code === 0) {
          this.providerlist = res.data.data
        }
      })
    },

    // 获取管理用户列表
    getAdminUserList (page, limit, key, value) {
      getAdminUserList(page, limit, key, value).then(res => {
        if (res.data.code === 0) {
          this.admUserList = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取IDC列表
    getIDCList () {
      getIDClist().then(res => {
        if (res.data.code === 0) {
          this.allIDCList = res.data.data
        }
      })
    },

    // 获取Tag列表
    getTagList () {
      getTagList().then(res => {
        if (res.data.code === 0) {
          this.allTagList = res.data.data
        }
      })
    },
    // table 选中的ID
    handleSelectChange (val) {
      let SelectIdList = []
      val.forEach(item => {
        SelectIdList.push(item.id)
      })
      this.tableSelectIdList = SelectIdList
    },
    handleDetail (paramsRow) {
      this.dialog2.show = true
      this.serverDetail = {
        cpu: '',
        cpu_count: '',
        cpu_cores: '',
        disk: '',
        disk_utilization: '',
        id: '',
        // instance_id: null
        // instance_type: null
        ip: '',
        memory: '',
        sysinfo: '',
        os_kernel: '',
        sn: ''
      }
      this.getServerDetailList('ip', paramsRow.ip)
      setTimeout(() => {
        this.formValidate = {
          id: paramsRow.id,
          hostname: paramsRow.hostname,
          ip: paramsRow.ip,
          public_ip: paramsRow.public_ip,
          port: paramsRow.port,
          idc: paramsRow.idc,
          region: paramsRow.region,
          admin_user: paramsRow.admin_user,
          tag_list: paramsRow.tag_list,
          detail: paramsRow.detail,
          expired_time: this.serverDetail.expired_time,
          instance_id: this.serverDetail.instance_id,
          instance_type: this.serverDetail.instance_type,
          instance_state: this.serverDetail.instance_state,
          cpu: this.serverDetail.cpu,
          // cpu_count: this.serverDetail.cpu_count,
          cpu_cores: this.serverDetail.cpu_cores,
          memory: this.serverDetail.memory,
          disk: this.serverDetail.disk,
          os_type: this.serverDetail.os_type,
          os_kernel: this.serverDetail.os_kernel,
          sn: this.serverDetail.sn,
          update_time: this.serverDetail.update_time
        }
      }, 500)
    },
    closeModal () {
      this.dialog.show = false
    },
    tagHandleChange (newTargetKeys) {
      this.formData.tag = newTargetKeys
    },
    tagFilter (data, query) {
      return data.label.indexOf(query) > -1
    },
    editModal (paramsRow, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      if (paramsRow && paramsRow.id) {
        // put
        this.getTagList()
        this.getAdminUserList()
        this.formValidate = {
          id: paramsRow.id,
          hostname: paramsRow.hostname,
          ip: paramsRow.ip,
          public_ip: paramsRow.public_ip,
          port: paramsRow.port,
          idc: paramsRow.idc,
          region: paramsRow.region,
          admin_user: paramsRow.admin_user,
          tag_list: paramsRow.tag_list,
          detail: paramsRow.detail
        }
      } else {
        // post
        this.getAdminUserList()
        this.getTagList()
        if (this.selectTag) {
          this.formValidate = {
            hostname: '',
            ip: '',
            port: '22',
            admin_user: '',
            idc: '',
            region: '',
            tag_list: [this.selectTag],
            detail: '',
            state: 'new'
          }
        } else {
          this.formValidate = {
            hostname: '',
            ip: '',
            port: '22',
            admin_user: '',
            idc: '',
            region: '',
            tag_list: [],
            detail: '',
            state: 'new'
          }
        }
      }
    },
    handleSubmit (value) {
      this.$refs[value].validate(valid => {
        if (valid) {
          setTimeout(() => {
            operationdomains(this.formValidate, this.editModalData).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getDomainList()
                // this.pageNum,
                // this.pageSize,
                // this.searchKey,
                // this.searchValue
                // this.getTagtree()
                this.modalMap.modalVisible = false
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
          }, 1000)
          // this.$Message.success('Success!')
        } else {
          this.$Message.error('缺少必要参数')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },

    handlerAssetUpdate () {
      // console.log(this.tableSelectIdList.length)
      if (this.tableSelectIdList.length > 6) {
        this.$Message.error(
          `手动更新请不要超过5个，默认添加的机器都会自动推送更新`
        )
        return
      }
      if (this.tableSelectIdList.length > 0) {
        this.$Spin.show({
          render: h => {
            return h('div', [
              h('Icon', {
                class: 'demo-spin-icon-load',
                props: {
                  type: 'ios-loading',
                  size: 18
                }
              }),
              h('div', '资产更新中....')
            ])
          }
        })
        assetServerUpdate({ id_list: this.tableSelectIdList }, 'post').then(
          res => {
            this.$Spin.hide()
            if (res.data.code === 0) {
              this.$Message.config({
                top: 24,
                duration: 5 // 停留时间
              })
              this.$Message.info(`${res.data.msg}`)
              this.getServerList(this.searchVal)
            } else {
              this.$Message.config({
                top: 24,
                duration: 5 // 停留时间
              })
              this.$Message.error(`${res.data.msg}`)
            }
          }
        )
      } else {
        this.$Message.info(`你总要选中点什么吧`)
      }
    },

    handleSyncTagTree () {
      this.loading = true
      this.$Modal.confirm({
        title: '提醒',
        content: '<p>向【作业配置】--【Tag树】进行同步资产任务</p>',
        loading: true,
        onOk: () => {
          setTimeout(() => {
            this.$Modal.remove()
            syncServerToTagTree().then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
              this.loading = false
            })
          }, 2000)
        },
        onCancel: () => {
          this.loading = false
          this.$Message.info('Clicked cancel')
        }
      })
    },

    handlerDelete () {
      // console.log(this.tableSelectIdList.length)
      if (this.tableSelectIdList.length > 0) {
        if (confirm(`确定要批量删除选中主机 `)) {
          operationServer({ id_list: this.tableSelectIdList }, 'delete').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getDomainList(this.searchVal)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            }
          )
        }
      } else {
        this.$Message.info(`你总要选中点什么吧`)
      }
    },
    // 删除
    delData (params) {
      if (confirm(`确定要删除 ${params.row.hostname}`)) {
        // console.log(params.row.id)
        operationServer(
          {
            server_id: params.row.id
          },
          'delete'
        ).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.tableData.splice(params.index, 1)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.getDomainList(this.searchKey, this.searchValue)
    },
    // 点击节点
    handlerTreeChange (obj) {
      if (obj.length !== 0) {
        const data = obj[0]
        this.pageNum = 1
        if (data.title === 'root') {
          this.selectTag = null
          this.getDomainList()
        } else if (data.pro_name) {
          this.selectTwo = data.node
          this.selectTag = data.id
          this.getDomainList('domain_provider', data.id)
        } else if (data.title === 'root' && !data.node) {
          this.selectTag = null
          this.selectTwo = data.title
          this.getDomainList()
        }
      }
    },
    // 翻页
    changePage (value) {
      this.pageNum = value
      if (this.selectTwo === 'tag') {
        if (this.searchValue) {
          this.getDomainList('domain_provider', this.searchValue)
        } else {
          this.getTagList()
        }
      } else if (this.selectTag) {
        this.getDomainList('domain_provider', this.selectTag)
      } else {
        this.getDomainList()
      }
    },
    // 切换分页
    handlePageSize (value) {
      this.pageSize = value
      this.pageNum = 1
      if (this.searchValue) {
        this.getDomainList(this.searchValue)
      } else if (this.selectTag) {
        this.getDomainList('domain_provider', this.selectTag)
      } else {
        this.getDomainList()
      }
    }
  },
  computed: {
    ...mapState({
      rules: state => state.user.rules
    })
  },
  watch: {
    // searchVal (val) {
    //   this.searchVal = val
    //   this.getServerList(this.searchVal)
    // }
  },

  mounted () {
    this.getPrivateTree()
    this.getPrivateList()
    this.getDomainList()
  }
}
</script>

<style lang="less" scoped>
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 200px;
    }
    &-input {
      display: inline-block;
      width: 200px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>
